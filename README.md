# 🌾 SÈNÈ — Plateforme Agricole Guinéenne

[![Node.js](https://img.shields.io/badge/NestJS-10.x-E0234E?logo=nestjs)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14.x-000000?logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://www.postgresql.org/)
[![MinIO](https://img.shields.io/badge/MinIO-S3_Compatible-C72C48?logo=minio)](https://min.io/)
[![Redis](https://img.shields.io/badge/Redis-BullMQ-DC382D?logo=redis)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://www.docker.com/)

> **Plateforme technologique connectant les productrices rurales de Guinée (Fouta Djallon & Haute-Guinée) aux acheteurs urbains de Conakry via des agents de terrain locaux.**  
> Objectif prioritaire : **Réduire drastiquement les pertes post-récolte** grâce à une traçabilité rigoureuse, une application mobile *offline-first*, un séquestre financier Mobile Money et un corridor logistique optimisé.

---

## 🗺️ Le Corridor Pilote (Phase 1)

```
[ VILLAGES RURAUX ]               [ CORRIDOR ROUTIER ]              [ MARCHÉS CONAKRY ]
Timbi-Madina (Pita/Labé)  ──┐
Tambikounda (Dinguiraye)  ──┼──> [ Mamou ] ──> [ Kindia ] ──> [ Marché Madina (Grossistes) ]
Kaganya (Productrices)    ──┘                                   [ Entrepôt Entag / Kipé      ]
  • Pesée & qualité par                                         • Déchargement & validation
    l'agent local                                               • Déblocage du séquestre
  • Saisie 100% Hors-Ligne                                      • Décaissage productrice
```

---

## 🏗️ Architecture Globale & Dépôt

Le projet est initialisé en deux dossiers principaux ultra-structurés :

```text
sènè/
├── backend/                     # API REST NestJS (Monolithe modulaire)
│   ├── Dockerfile               # Multi-stage production Alpine (non-root)
│   ├── prisma/
│   │   ├── schema.prisma        # Schéma PostgreSQL complet avec relations & index
│   │   └── seed.ts              # Données de démarrage (Régions, Préfectures, Cultures, Utilisateurs)
│   ├── src/
│   │   ├── main.ts              # Bootstrap (Helmet, CORS, Swagger, ValidationPipe)
│   │   ├── app.module.ts        # Module racine
│   │   ├── common/              # Sécurité, décorateurs, filtres, MinIO & Prisma
│   │   └── modules/             # Auth, Localities, Producers, Offers, Logistics, Payments...
│   └── README.md                # Guide complet backend & DevOps
│
├── frontend/                    # Back-Office Admin Next.js 14
│   ├── Dockerfile               # Multi-stage standalone Next.js
│   ├── src/
│   │   ├── app/                 # Cockpit de supervision et KPIs du corridor
│   │   └── components/          # Sidebar, Header, Tableaux de logistique
│   └── README.md                # Guide complet frontend
│
├── docker-compose.yml           # Orchestration Postgres + Redis + MinIO + Backend + Frontend
├── .env.example                 # Variables d'environnement documentées
└── README.md                    # Ce document
```

---

## 🚀 Démarrage Rapide avec Docker Compose

Toute l'infrastructure technique (Base de données, Stockage S3, File asynchrone, API et Back-office) démarre en une seule commande :

```bash
# 1. Cloner le dépôt et copier la configuration d'environnement
cp .env.example .env

# 2. Démarrer l'ensemble des services en arrière-plan
docker-compose up -d --build

# 3. Vérifier l'état de santé des conteneurs
docker-compose ps
```

### URLs et Portails d'Accès

| Service | URL locale | Identifiants par défaut |
| :--- | :--- | :--- |
| **Back-Office Next.js** | `http://localhost:3000` | Interface administrateur |
| **API REST NestJS** | `http://localhost:4000/api/v1` | - |
| **Documentation Swagger** | `http://localhost:4000/api/docs` | Auth Bearer JWT |
| **Métriques Prometheus** | `http://localhost:4000/metrics` | Métriques standard + applicatives |
| **Console MinIO S3** | `http://localhost:9001` | User: `sene_minio_admin` / Pass: `sene_minio_password_2026` |
| **API MinIO S3** | `http://localhost:9000` | Compatible AWS S3 SDK |
| **PostgreSQL Database** | `localhost:5432` | DB: `sene_db` / User: `sene_admin` |
| **Redis & BullMQ** | `localhost:6379` | Auth: `sene_redis_secret` |

---

## 🔒 Métriques de Sécurité & Standards DevOps

- **Conformité OWASP :** Protection HTTP via `helmet` (CSP, HSTS, X-Frame-Options, noSniff).
- **Protection Anti-DDoS :** `@nestjs/throttler` configuré sur tous les endpoints publics.
- **Hachage Argon2 :** Résistant aux attaques par force brute GPU pour tous les mots de passe.
- **Conteneurs non-root :** Exécution sous utilisateur non privilégié (`node` et `nextjs`) avec gestion des signaux POSIX via `dumb-init`.
- **Précision Financière GNF :** Les montants en Francs Guinéens sont stockés sous forme de `BigInt` (aucun problème d'arrondi à virgule flottante) et sérialisés proprement.
- **Chiffrement & Séquestre :** Gestion du séquestre (*escrow*) avec déblocage garanti uniquement après signature de livraison.
- **Stockage S3 MinIO :**
  - `sene-producers` (Privé) : Cartes d'identité, photos KYC des productrices.
  - `sene-crops` (Public) : Photos des lots agricoles et légumes.
  - `sene-deliveries` (Privé) : Tickets de pesée pont-bascule, bordereaux de livraison émargés.

---

## 📋 Feuille de Route d'Implémentation

- [x] **Étape 1 :** Structure Monorepo (`backend` & `frontend`), architecture modulaire et DevOps (Docker, MinIO, Redis, Swagger, Prometheus).
- [x] **Étape 2 :** Schéma Prisma complet avec relations, index, hiérarchie géographique et scoring de crédit.
- [ ] **Étape 3 :** Liste détaillée des endpoints REST par module avec validation DTO et gestion d'erreurs.
- [ ] **Étape 4 :** Stratégie de synchronisation offline pour l'application mobile agent (format des mutations, gestion d'idempotence, résolution des conflits).
- [ ] **Étape 5 :** Génération du backend module par module avec tests unitaires et d'intégration.
- [ ] **Étape 6 :** Application mobile Flutter (Drift SQLite, offline queue) & finalisation du back-office Next.js.
