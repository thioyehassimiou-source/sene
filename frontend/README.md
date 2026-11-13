# 🖥️ Sènè Front-Office & Admin — Next.js 14 Guide

> **Operations Dashboard for Agricultural Corridor Logistics, Quality Verification & Escrow Settlements**

---

## 📑 Table of Contents
1. [Overview & Role](#1-overview--role)
2. [Tech Stack](#2-tech-stack)
3. [Key Modules & UI Capabilities](#3-key-modules--ui-capabilities)
4. [Project Structure](#4-project-structure)
5. [Docker Multi-Stage Deployment](#5-docker-multi-stage-deployment)
6. [Environment Variables](#6-environment-variables)
7. [Local Development](#7-local-development)

---

## 1. Overview & Role

The Sènè Back-Office is the operational control room of the platform, utilized by:
- **Operations Directors:** Real-time visibility into the Dinguiraye/Labé ➔ Conakry agricultural corridors.
- **Logistics Coordinators:** Monitoring truck shipments, weighbridge tickets, and arrival at wholesale markets (Madina, Entag).
- **Financial Controllers:** Overseeing the Mobile Money escrow balance (Orange Money & MTN MoMo) and approving bulk cash disbursements to village agents.

---

## 2. Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **Next.js 14 (App Router)** | Server Components, fast streaming, and edge-ready API routes. |
| **React 18 & TypeScript** | Strict type safety and rich interactive interfaces. |
| **Tailwind CSS** | Custom design system optimized for agricultural dashboards. |
| **Lucide Icons** | Consistent icon set for transport, products, and financials. |
| **TanStack Query v5** | Server-state caching and synchronization with the NestJS API. |
| **Docker (Standalone Output)** | Optimized production container footprint (~120MB). |

---

## 3. Key Modules & UI Capabilities

### 1. Operations Overview (Dashboard)
- Real-time KPIs: Active producers count, tonnage harvested, escrow volume in Guinean Francs (GNF).
- Active corridor batch timeline tracking transit checkpoints (Labé ➔ Mamou ➔ Kindia ➔ Coyah ➔ Conakry).

### 2. Producer Scoring Directory
- Profiles of illiterate women farmers managed by local agents.
- Photo IDs, trusted guardian contact numbers, village GPS coordinates.
- Historical fulfillment track record (`reliabilityScore` 0-100) acting as a foundational metric for micro-credit scoring.

### 3. Supply & Harvest Lot Management
- Offers published by agents with photos uploaded to MinIO S3 (`sene-crops`).
- Quality grades (Grade A / First choice, Grade B, Standard) and packaging units (50kg bags, crates, kg).

### 4. Logistics & Corridor Tracking
- Weighbridge ticket validation (photos stored in private MinIO bucket `sene-deliveries`).
- Truck plate and driver contact dispatching.

### 5. Escrow & Disbursal Ledger
- Visualization of funds locked upon buyer order confirmation.
- Safe release to farmer upon delivery confirmation.

---

## 4. Project Structure

```text
frontend/
├── Dockerfile                   # Multi-stage production container (Next.js standalone)
├── .dockerignore
├── package.json
├── tsconfig.json
├── next.config.mjs              # Standalone output & MinIO image domains
├── tailwind.config.ts           # Sènè agricultural color palette
├── src/
│   ├── app/
│   │   ├── globals.css          # Tailwind base directives
│   │   ├── layout.tsx           # Global shell with Sidebar and Header
│   │   └── page.tsx             # Main operational cockpit
│   └── components/
│       ├── Sidebar.tsx          # Navigation and offline sync badge
│       ├── Header.tsx           # Search, services connectivity indicator
│       └── MetricCard.tsx       # Reusable KPI card
└── README.md
```

---

## 5. Docker Multi-Stage Deployment

The `Dockerfile` leverages Next.js **standalone mode**:
- **Stage 1 (base):** Alpine Linux.
- **Stage 2 (dependencies):** Installs package dependencies.
- **Stage 3 (builder):** Compiles Next.js with `output: 'standalone'`.
- **Stage 4 (production):** Runs under unprivileged `nextjs` user, exposing port 3000.

---

## 6. Environment Variables

Configured in `.env` (or via `docker-compose.yml`):

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Listening port | `3000` |
| `NEXT_PUBLIC_API_URL` | Sènè NestJS API endpoint | `http://localhost:4000/api/v1` |
| `NEXT_PUBLIC_APP_NAME`| Platform name | `Sènè Plateforme Agricole` |

---

## 7. Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

