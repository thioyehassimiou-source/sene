# 🏛️ Architecture Technique du Backend — Sènè Platform

> **Guide d'Architecture d'Entreprise pour un Monolithe Modulaire Résilient et Offline-First**

---

## 1. Principes Directeurs

Le système Sènè est conçu selon quatre principes architecturaux non négociables :

1. **Monolithe Modulaire plutôt que Microservices :**  
   Pour un pilote agricole en Guinée, la complexité opérationnelle d'un maillage de microservices (latence réseau, transactions distribuées 2PC, orchestration Kubernetes lourde) est contre-productive. Un monolithe modulaire bien structuré avec injection de dépendances NestJS offre la même isolation de domaine sans le coût d'exploitation.

2. **Offline-First par Conception :**  
   Les villages producteurs (Fouta Djallon, Haute-Guinée) disposent d'un réseau cellulaire instable ou inexistant. Toutes les actions de l'agent local sont stockées localement sur son terminal mobile (SQLite Drift), affectées d'un identifiant universel (`idempotencyKey` UUIDv4) et rejouées sur le backend dès le retour d'une connexion 3G/4G.

3. **Précision Financière Stricte en Francs Guinéens (GNF) :**  
   Le Franc Guinéen ne comporte pas de centimes et s'exprime en montants élevés (ex. 350 000 GNF le sac). Tous les montants financiers sont modélisés en `BigInt` au niveau de la base PostgreSQL et de Prisma pour interdire tout problème d'arrondi à virgule flottante (`0.1 + 0.2 !== 0.3`). Un intercepteur sérialise automatiquement les BigInt en chaînes JSON lors des réponses HTTP.

4. **Fournisseurs Interchangeables (Architecture Hexagonale) :**  
   Les opérateurs de télécommunications (Orange Guinée, MTN Guinée) et les passerelles SMS/WhatsApp sont encapsulés derrière des interfaces abstraites (`PaymentProvider`, `NotificationProvider`). On peut basculer d'un fournisseur à un autre sans modifier une seule ligne de logique métier.

---

## 2. Découpage en Domaines Métier (Bounded Contexts)

```
+---------------------------------------------------------------------------------------------------+
|                                          API GATEWAY                                              |
|            [Helmet] ---> [Throttler Guard] ---> [JWT & Roles Guard] ---> [Validation Pipe]        |
+---------------------------------------------------------------------------------------------------+
                                                  |
           +--------------------------------------+------------------------------------+
           |                                      |                                    |
           v                                      v                                    v
+----------------------+              +-----------------------+              +--------------------+
|  CORE & IDENTITY     |              |  COMMERCIAL & SUPPLY  |              |  LOGISTICS & SETTLE|
|                      |              |                       |              |                    |
| • AuthModule         |              | • LocalitiesModule    |              | • LogisticsModule  |
| • UsersModule (RBAC) |              | • ProducersModule     |              | • PaymentsModule   |
| • AuditLogModule     |              | • ProductsModule      |              |   (Escrow Ledger)  |
|                      |              | • OffersModule        |              | • SyncModule       |
|                      |              | • OrdersModule        |              |   (Offline Queue)  |
+----------------------+              +-----------------------+              +--------------------+
           |                                      |                                    |
           +--------------------------------------+------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|                                      INFRASTRUCTURE LAYER                                         |
|  • PrismaService (PostgreSQL 16)                     • StorageService (MinIO S3 SDK)              |
|  • BullMQ QueueService (Redis 7)                     • Health & Metrics (Prometheus)              |
+---------------------------------------------------------------------------------------------------+
```

---

## 3. Gestion des Données & Schéma Relationnel

### Précision des Clés & Intégrité
- **Identifiants Primaires :** Tous les identifiants utilisent le standard `UUIDv4`. Cela permet à l'application mobile Flutter de générer des identifiants valides hors-ligne sans risque de collision avec la base centrale.
- **Transactions Atomiques :** La réservation des stocks dans `OrdersModule` et la libération du séquestre dans `PaymentsModule` s'exécutent dans des transactions isolées Prisma (`prisma.$transaction([...])`) pour garantir l'atomicité ACID.

### Indexation & Performance
- Index composites sur `[agentId, status]` pour accélérer le rafraîchissement des tableaux de bord agents.
- Index B-Tree sur les clés d'idempotence `[idempotencyKey]` garantissant une recherche en $O(1)$ lors de la réconciliation offline.
- Clés étrangères avec contraintes `onDelete: Restrict` sur les entités comptables (Paiements, Commandes, Productrices) afin d'interdire toute suppression accidentelle de données financières ou d'historique.

---

## 4. Stratégie de Stockage Objet (MinIO S3)

Les fichiers multimédias et justificatifs sont externalisés sur un cluster MinIO S3 local ou cloud :

```text
minio-storage/
├── sene-producers/         # BUCKET PRIVÉ (ACL: private)
│   └── {producerId}/
│       └── portrait.jpg    # Photo d'identité de la productrice
│
├── sene-crops/             # BUCKET PUBLIC (ACL: download)
│   └── {offerId}/
│       ├── lot_photo_1.jpg # Photo des sacs pesés au village
│       └── lot_photo_2.jpg
│
└── sene-deliveries/        # BUCKET PRIVÉ (ACL: private)
    └── {deliveryId}/
        ├── weighbridge.jpg # Ticket scanné du pont-bascule
        └── discharge.jpg   # Bordereau de livraison signé par l'acheteur
```

L'accès aux buckets privés s'effectue via des **URLs pré-signées temporaires** générées par le service `StorageService` (`getPresignedDownloadUrl()`, durée de validité : 1 heure).

---

## 5. Moteur de Synchronisation Offline & Idempotence

```
[ Application Mobile Agent (Drift SQLite) ]
   |
   |-- 1. Agent saisit une récolte hors-ligne
   |-- 2. Génère un UUID local (idempotencyKey)
   |-- 3. Stocke l'action dans sa table locale 'pending_actions'
   |
   | (L'agent arrive en zone de couverture 3G/4G)
   |
   +---> POST /api/v1/sync/batch (avec le lot d'actions et leurs UUIDs)
            |
            v
   [ Backend NestJS SyncModule ]
      |
      |-- 4. Recherche idempotencyKey dans 'SyncMutationQueue'
      |      ├── Si existe déjà : renvoie le statut existant (No-Op, évite les doublons)
      |      └── Si nouvelle :
      |            a. Applique la mutation métier dans une transaction
      |            b. Enregistre le succès avec horodatage serveur
      |            c. Retourne le résultat consolidé à l'application mobile
      |
      v
   [ Mise à jour du statut dans SQLite mobile -> action marquée 'SYNCED' ]
```

---

## 6. Observabilité & Haute Disponibilité

1. **Surveillance Santé (`/api/v1/health`) :**  
   Interroge la connectivité active de PostgreSQL, Redis et MinIO. Si l'un des sous-systèmes critiques est injoignable, le statut global bascule en `degraded` avec code HTTP 503 pour déclencher le redémarrage automatique Docker.
2. **Métriques Prometheus (`/metrics`) :**  
   Collecte le débit de requêtes HTTP, la latence au 95e percentile, l'utilisation mémoire Node.js et la profondeur des files d'attente BullMQ.
3. **Arrêt Propre (*Graceful Shutdown*) :**  
   Activation des hooks `enableShutdownHooks()` dans `main.ts` pour achever les transactions en cours avant l'interruption des conteneurs lors des déploiements sans interruption de service (*zero-downtime*).

