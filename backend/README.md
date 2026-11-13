# 🌿 Sènè Backend API — Architecture & DevOps Guide

> **Production-Ready Modular Monolith for Guinean Agricultural Supply Chain**  
> Connecting Rural Women Producers to Urban Buyers through Local Field Agents.

---

## 📑 Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Tech Stack & DevOps Tooling](#2-tech-stack--devops-tooling)
3. [Directory Layout](#3-directory-layout)
4. [Security Architecture & Best Practices](#4-security-architecture--best-practices)
5. [Database & Prisma Schema](#5-database--prisma-schema)
6. [Offline-First Sync Engine](#6-offline-first-sync-engine)
7. [Abstract Interfaces (Payments & Notifications)](#7-abstract-interfaces-payments--notifications)
8. [MinIO S3 Object Storage](#8-minio-s3-object-storage)
9. [DevOps, Docker & Monitoring](#9-devops-docker--monitoring)
10. [Local Development Quickstart](#10-local-development-quickstart)

---

## 1. Architecture Overview

Sènè is engineered as a **Modular Monolith** in NestJS. It balances low operational complexity with strict domain boundaries, ensuring clean separation of concerns without the distributed transaction overhead of microservices:

```
+-----------------------------------------------------------------------------------+
|                                  NestJS Core API                                  |
|                                                                                   |
|  +--------------------+   +--------------------+   +---------------------------+  |
|  |    Auth & Users    |   |     Localities     |   |    Producers & Scoring    |  |
|  +--------------------+   +--------------------+   +---------------------------+  |
|  | Products & Offers  |   | Orders & Logistics |   | Payments & Escrow Ledger  |  |
|  +--------------------+   +--------------------+   +---------------------------+  |
|  | Offline Sync Queue |   | Notifications Hub  |   | BullMQ Queues / Workers   |  |
|  +--------------------+   +--------------------+   +---------------------------+  |
+-----------------------------------------------------------------------------------+
       |                       |                      |                   |
       v                       v                      v                   v
+--------------+       +---------------+      +----------------+   +--------------+
|  PostgreSQL  |       | Redis/BullMQ  |      |    MinIO S3    |   |  Prometheus  |
|  (Data & FK) |       | (Async Tasks) |      | (Media & Proof)|   |  (/metrics)  |
+--------------+       +---------------+      +----------------+   +--------------+
```

---

## 2. Tech Stack & DevOps Tooling

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | NestJS 10 (TypeScript) | Strong modular architecture, dependency injection, declarative validation. |
| **ORM** | Prisma ORM 5 | Type-safe migrations, complex relations, and query optimization. |
| **Database** | PostgreSQL 16 (Alpine) | ACID transactions, native JSONB support, robust spatial and indexing capabilities. |
| **Async Queues** | Redis 7 + BullMQ | Reliable delayed retries for SMS, WhatsApp alerts, and payment webhooks. |
| **Object Storage**| MinIO S3-Compatible | Private buckets for KYC IDs & weighbridge tickets; public bucket for crop photos. |
| **API Docs** | Swagger / OpenAPI 3.0 | Auto-generated interactive documentation with JWT Bearer auth at `/api/docs`. |
| **Metrics** | Prometheus (`prom-client`) | Exposed at `/metrics` for container health, queue delays, and HTTP latency. |
| **Security** | Helmet, Argon2, Throttler | OWASP compliant headers, brute-force limits, and modern password hashing. |

---

## 3. Directory Layout

```text
backend/
├── Dockerfile                   # Multi-stage production container (Alpine, non-root)
├── .dockerignore
├── package.json
├── tsconfig.json
├── nest-cli.json
├── prisma/
│   ├── schema.prisma            # Complete domain schema, enums, indices & relations
│   └── seed.ts                  # Seed script for Regions, Prefectures, Crops & Test Users
├── src/
│   ├── main.ts                  # Bootstrap with Helmet, CORS, Swagger, Validation, Graceful Exit
│   ├── app.module.ts            # Root module wiring
│   ├── common/
│   │   ├── decorators/          # @CurrentUser(), @Roles()
│   │   ├── filters/             # AllExceptionsFilter (Standard error response envelope)
│   │   ├── guards/              # JwtAuthGuard, RolesGuard (RBAC)
│   │   ├── interceptors/        # TransformInterceptor (Uniform envelope & BigInt GNF serializer)
│   │   └── services/
│   │       ├── prisma.service.ts # Prisma client lifecycle hooks
│   │       └── storage.service.ts# MinIO S3 upload & presigned URLs
│   └── modules/
│       ├── health/              # Healthcheck endpoint (/api/v1/health)
│       ├── metrics/             # Prometheus scrape endpoint (/metrics)
│       ├── auth/                # JWT & Phone OTP authentication
│       ├── users/               # User profiles & roles (ADMIN, AGENT, BUYER)
│       ├── localities/          # Region > Prefecture > SubPrefecture > Village
│       ├── producers/           # Illiterate farmer profiles, guardian contact, scoring base
│       ├── products/            # Crops catalog (Pomme de terre Timbi, Fonio Dinguiraye)
│       ├── offers/              # Batches published by agents on behalf of producers
│       ├── orders/              # Buyer reservations and multi-item orders
│       ├── logistics/           # Village collection, weighbridge verification & corridor transit
│       ├── payments/            # Escrow ledger, Orange Money GN & MTN MoMo adapters
│       ├── notifications/       # SMS & WhatsApp dispatch engine
│       ├── sync/                # Offline sync engine with idempotency keys
│       └── queues/              # BullMQ queue workers and dispatchers
└── test/                        # Unit and e2e integration test suites
```

---

## 4. Security Architecture & Best Practices

1. **Strict Content Security & Headers:** Protected via `helmet` with CSP disabled in local dev and enforced in production.
2. **CORS Hardening:** Whitelisted origins configured via `CORS_ORIGIN` environment variable.
3. **Rate Limiting (Anti-DDoS):** Configured via `@nestjs/throttler` (default: 120 requests/minute per IP).
4. **Input Sanitization & DTO Validation:** Global `ValidationPipe` with `whitelist: true` and `forbidNonWhitelisted: true` prevents mass assignment vulnerabilities.
5. **Argon2 Password Hashing:** Resistant to GPU/ASIC brute-force attacks.
6. **JWT Token Rotation:** Short-lived access tokens (15m - 24h) and secure hashed refresh tokens in the database.
7. **Role-Based Access Control (RBAC):** Custom `@Roles()` decorator and `RolesGuard` strictly checking `ADMIN`, `AGENT`, or `BUYER`.
8. **Financial Precision:** All amounts in Guinean Francs (GNF) are stored as `BigInt` to prevent floating-point rounding errors, and serialized safely via `TransformInterceptor`.

---

## 5. Database & Prisma Schema

Key domain models configured in `prisma/schema.prisma`:
- **Administrative Hierarchy:** `Region` ➔ `Prefecture` ➔ `SubPrefecture` ➔ `Village`.
- **Producers:** Profile tracking for illiterate women farmers, trusted guardian contacts, GPS coordinates, and historical `reliabilityScore` (0-100) for future micro-credit scoring.
- **Logistics Corridor:** Tracks shipments from Timbi-Madina / Dinguiraye collection points to Conakry markets (Madina, Entag), with weighbridge receipt photo uploads.
- **Payment & Escrow:** Locked upon buyer payment, and released to producer (minus platform and agent commissions) upon delivery receipt confirmation.

---

## 6. Offline-First Sync Engine

Local field agents operate in rural villages with zero or intermittent cellular coverage:
1. **Local UUID Generation:** The mobile Drift SQLite database generates client UUIDs (`idempotencyKey`).
2. **Action Queue (`SyncMutationQueue`):** When network returns, the mobile app posts a batch of mutations to `/api/v1/sync/batch`.
3. **Idempotent Application:** The backend checks the `idempotencyKey`. If already processed, it returns the cached result without duplicate side-effects.
4. **Conflict Resolution Strategy:** Server-authoritative inventory checks for offers; last-write-wins with version tracking for producer biographical updates.

---

## 7. Abstract Interfaces (Payments & Notifications)

### Payment Gateway Interface (`payment-provider.interface.ts`)
Decoupled payment providers allowing dynamic switching between:
- `OrangeMoneyProvider` (Guinea Web Payment API)
- `MtnMomoProvider` (MTN Mobile Money Guinea API)
- `CashOnDeliveryProvider` (COD collected at destination)
- `MockPaymentProvider` (Local development & sandbox testing)

### Notification Interface (`notification-provider.interface.ts`)
Unified messaging interface supporting:
- `OrangeSmsGuineeProvider` (Local Guinean SMS gateway)
- `TwilioProvider` / `Infobip`
- `MetaWhatsAppProvider` (WhatsApp Cloud API)
- `MockNotificationProvider` (Console logging during dev)

---

## 8. MinIO S3 Object Storage

MinIO provides S3-compatible cloud storage:
- **`sene-producers` (Private):** KYC identity documents, producer portraits.
- **`sene-crops` (Public read):** High-resolution photos of harvest lots.
- **`sene-deliveries` (Private):** Weighbridge tickets, driver manifests, signed delivery slips.

Accessible via:
- **API Endpoint:** `http://localhost:9000`
- **Web Console UI:** `http://localhost:9001` (User: `sene_minio_admin` / Pass: `sene_minio_password_2026`)

---

## 9. DevOps, Docker & Monitoring

### Multi-Stage Dockerfile Highlights:
- **Alpine Linux Base:** Minimal attack surface.
- **Unprivileged User:** Process runs as `node:node` (UID 1000).
- **Process Supervisor:** Uses `dumb-init` for proper POSIX signal propagation (`SIGTERM`, `SIGINT`).
- **Healthcheck:** Automatic health monitoring via `/api/v1/health`.

### Prometheus Metrics:
Scrape endpoint available at:
```http
GET http://localhost:4000/metrics
```

---

## 10. Local Development Quickstart

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp ../.env.example .env

# 3. Generate Prisma client & run migrations
npx prisma generate
npx prisma migrate dev --name init

# 4. Seed initial corridor data
npm run prisma:seed

# 5. Start API in development mode
npm run start:dev

# 6. Access Documentation
# Swagger: http://localhost:4000/api/docs
# Health:  http://localhost:4000/api/v1/health
```

