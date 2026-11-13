# 📊 Backend Development Kanban Board — Sènè Platform

> **Interactive Checklist & Module Delivery Tracker**  
> Use this document to track sprint progress, definition of done, and module deliverables.

---

## 📈 Global Progress Summary
- **Foundation & Infrastructure:** 100% (PostgreSQL, Redis, MinIO S3, Swagger, Docker Compose)
- **Database Modeling (Prisma):** 100% (14 models, enums, indexes, seeds)
- **Core Architecture & Common Utilities:** 100% (Filters, Interceptors, Guards, Storage Service)
- **Business Modules Implementation:** In Progress (Roadmap below)

---

## 📋 Kanban Board

| 🎯 Backlog | 🚧 In Progress | 🧪 Testing & Review | ✅ Done |
| :--- | :--- | :--- | :--- |
| • Module Notifications (SMS/WhatsApp) | • Étape 3 : Spécification des endpoints REST | • Configuration Docker Compose Multi-services | • Setup Monorepo (`backend` & `frontend`) |
| • Module Queues BullMQ Workers | • Étape 4 : Moteur de Synchro Offline | • Schéma Prisma & Migrations | • Infra MinIO S3 + Init Buckets |
| • Module Logistics Corridor | | • Sécurité Helmet, CORS & Throttler | • Base de données PostgreSQL 16 |
| • Module Payments & Escrow Ledger | | • Service de stockage MinIO S3 SDK | • Cache & File Redis 7 |
| | | • Intercepteur BigInt GNF | • Swagger OpenAPI 3.0 & Metrics Prometheus |

---

## 🗂️ Module-by-Module Checklist

### 1. 🔐 Module Auth & Users (`src/modules/auth`, `src/modules/users`)
- [x] Définition des rôles RBAC (`ADMIN`, `AGENT`, `BUYER`)
- [x] Configuration JWT & Guard Passport
- [ ] DTOs de connexion & validation par numéro de téléphone guinéen (`+224...`)
- [ ] Service de hachage de mot de passe `Argon2`
- [ ] Endpoint `POST /api/v1/auth/login`
- [ ] Endpoint `POST /api/v1/auth/refresh` (Rotation des refresh tokens en base)
- [ ] Endpoint `POST /api/v1/auth/logout`
- [ ] Endpoint `GET /api/v1/users/me`
- [ ] Tests unitaires du service d'authentification
- [ ] Documentation module (`src/modules/auth/README.md`)

---

### 2. 🗺️ Module Localities (`src/modules/localities`)
- [x] Modélisation hiérarchique : Région ➔ Préfecture ➔ Sous-Préfecture ➔ Village
- [x] Données initiales seedées pour le corridor Labé/Pita/Dinguiraye ➔ Conakry
- [ ] Contrôleur & Services pour requêter les localités en cascade
- [ ] Endpoint `GET /api/v1/localities/regions`
- [ ] Endpoint `GET /api/v1/localities/prefectures?regionId=`
- [ ] Endpoint `GET /api/v1/localities/sub-prefectures?prefectureId=`
- [ ] Endpoint `GET /api/v1/localities/villages?subPrefectureId=`
- [ ] Endpoint `POST /api/v1/localities/villages` (Ajout avec repères visuels)
- [ ] Cache Redis des localités (données quasi-statiques)
- [ ] Tests unitaires & e2e
- [ ] Documentation module (`src/modules/localities/README.md`)

---

### 3. 👩‍🌾 Module Producers & Credit Scoring (`src/modules/producers`)
- [x] Modélisation de la productrice rurale (tuteur, coopérative, photo MinIO, score)
- [ ] Upload de la photo d'identité vers le bucket privé MinIO `sene-producers`
- [ ] Algorithme de calcul du `reliabilityScore` (0-100) basé sur l'historique des ventes
- [ ] DTO de création adapté à la saisie de terrain par l'agent
- [ ] Endpoint `POST /api/v1/producers` (Support de l'idempotence offline)
- [ ] Endpoint `GET /api/v1/producers` (Filtres par préfecture, village, coopérative)
- [ ] Endpoint `GET /api/v1/producers/:id` (Profil complet + métriques de crédit)
- [ ] Endpoint `PATCH /api/v1/producers/:id` (Mise à jour par agent assigné)
- [ ] Tests unitaires du calcul de scoring
- [ ] Documentation module (`src/modules/producers/README.md`)

---

### 4. 🥔 Module Products & Offers (`src/modules/products`, `src/modules/offers`)
- [x] Modélisation des cultures (Pomme de terre, Fonio) et grades de qualité (A, B, Standard)
- [x] Modélisation des offres avec unités (Sac 50kg, Caisse, Kg) et montants GNF
- [ ] Upload des photos de récolte vers le bucket MinIO `sene-crops`
- [ ] Endpoint `GET /api/v1/products` (Catalogue des cultures autorisées)
- [ ] Endpoint `POST /api/v1/offers` (Publication par l'agent local)
- [ ] Endpoint `GET /api/v1/offers` (Catalogue d'offres publiques pour acheteurs)
- [ ] Endpoint `GET /api/v1/offers/:id`
- [ ] Endpoint `PATCH /api/v1/offers/:id/status` (DRAFT, PUBLISHED, RESERVED, SOLD_OUT)
- [ ] Vérification automatique d'expiration d'offre
- [ ] Tests unitaires & documentation module (`src/modules/offers/README.md`)

---

### 5. 🛒 Module Orders (`src/modules/orders`)
- [x] Modélisation commande multi-lots et ventilation des commissions (Plateforme, Agent, Net)
- [ ] Transaction Prisma atomique : réservation du stock de l'offre
- [ ] Endpoint `POST /api/v1/orders` (Passation de commande par acheteur)
- [ ] Endpoint `GET /api/v1/orders` (Filtrage selon le rôle : acheteur, agent, admin)
- [ ] Endpoint `GET /api/v1/orders/:id`
- [ ] Endpoint `POST /api/v1/orders/:id/cancel` (Restitution immédiate du stock)
- [ ] Tests de concurrence (race condition sur le stock de l'offre)
- [ ] Documentation module (`src/modules/orders/README.md`)

---

### 6. 🚚 Module Logistics & Corridor (`src/modules/logistics`)
- [x] Modélisation des expéditions de corridor (camion, chauffeur, tickets de pesée)
- [ ] Téléversement du ticket de pesée pont-bascule sur MinIO `sene-deliveries`
- [ ] Endpoint `POST /api/v1/logistics/deliveries` (Assignation chauffeur et véhicule)
- [ ] Endpoint `PATCH /api/v1/logistics/deliveries/:id/weighbridge` (Validation pesée & grade)
- [ ] Endpoint `PATCH /api/v1/logistics/deliveries/:id/checkpoints` (Statut transit Mamou/Kindia)
- [ ] Endpoint `POST /api/v1/logistics/deliveries/:id/confirm-receipt` (Décharge finale Conakry)
- [ ] Notification automatique SMS à la confirmation d'arrivée
- [ ] Documentation module (`src/modules/logistics/README.md`)

---

### 7. 💳 Module Payments & Escrow Ledger (`src/modules/payments`)
- [x] Interface abstraite de paiement (`PaymentProvider`)
- [x] Modélisation du séquestre et des versements productrices (`ProducerPayout`)
- [ ] Provider `MockPaymentProvider` (pour développement et tests)
- [ ] Provider `OrangeMoneyGuineeProvider` (Web Payment API)
- [ ] Provider `MtnMomoGuineeProvider` (Mobile Money API)
- [ ] Endpoint `POST /api/v1/payments/initiate` (Appel opérateur télécom)
- [ ] Endpoint `POST /api/v1/payments/webhook/:provider` (Notification sécurisée)
- [ ] Endpoint `POST /api/v1/payments/release-escrow/:orderId` (Déblocage des fonds)
- [ ] Endpoint `POST /api/v1/payments/disburse-payout` (Preuve de décaissage liquide au village)
- [ ] Documentation module (`src/modules/payments/README.md`)

---

### 8. 📲 Module Offline Sync Engine (`src/modules/sync`)
- [x] Modélisation de la file d'actions (`SyncMutationQueue`) avec `idempotencyKey`
- [ ] Parseur et routeur de mutations génériques (CREATE/UPDATE Producer, Offer, Checkpoint)
- [ ] Résolution de conflits : stratégie Server-Authoritative pour stocks, Last-Write-Wins pour profils
- [ ] Endpoint `POST /api/v1/sync/batch` (Upload en masse des actions enregistrées hors-ligne)
- [ ] Endpoint `GET /api/v1/sync/pull?since=` (Delta sync vers le Drift SQLite de l'agent)
- [ ] Tests d'idempotence (envois répétés d'un même lot sans duplication)
- [ ] Documentation module (`src/modules/sync/README.md`)

---

### 9. 📢 Module Notifications & Queues BullMQ (`src/modules/notifications`, `src/modules/queues`)
- [x] Interface abstraite `NotificationProvider` (SMS et WhatsApp)
- [x] Modélisation de l'audit trail `NotificationLog`
- [ ] Worker BullMQ pour l'envoi asynchrone non-bloquant
- [ ] Templates SMS guinéens (en français simple / translittération)
- [ ] Retries automatiques avec backoff exponentiel en cas de défaillance réseau
- [ ] Documentation module (`src/modules/notifications/README.md`)

