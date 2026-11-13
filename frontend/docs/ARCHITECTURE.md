# 🏛️ Architecture Technique du Front-Office — Sènè Platform

> **Next.js 14 App Router, Architecture Hybride (Server & Client Components) & Intégration MinIO**

---

## 1. Principes Directeurs

1. **Next.js 14 App Router :**  
   Utilisation exclusive du répertoire `src/app/` avec découpage entre **Server Components** (rendu serveur instantané sans JavaScript superflu) et **Client Components** (`'use client'` pour l'interactivité des filtres et formulaires).

2. **Accès Hybride aux Médias MinIO S3 :**  
   Configuration de `next.config.mjs` avec `remotePatterns` autorisant le chargement sécurisé des photos de récolte et justificatifs de pesée depuis l'hôte MinIO (`http://localhost:9000` et `http://minio:9000`).

3. **Performance & Empreinte Conteneur Minimale :**  
   Compilation avec l'option `output: 'standalone'` produisant un conteneur Docker autonome de moins de 120 Mo, exécuté sous un compte utilisateur Linux non privilégié (`nextjs:nodejs`).

---

## 2. Découpage des Composants

```
src/
├── app/
│   ├── layout.tsx         # [SERVER] Enveloppe globale (HTML, polices, métadonnées)
│   ├── page.tsx           # [SERVER] Tableau de bord opérationnel du corridor
│   └── globals.css        # Directives Tailwind CSS
│
└── components/
    ├── Sidebar.tsx        # [CLIENT] Navigation latérale avec compteurs d'alertes
    ├── Header.tsx         # [CLIENT] Barre de recherche globale et statut système
    └── MetricCard.tsx     # [SERVER/CLIENT] Carte d'indicateur KPI
```

---

## 3. Communication avec l'API NestJS

Les appels vers le backend NestJS (`/api/v1`) sont encapsulés via un client HTTP centralisé gérant :
- L'injection automatique de l'en-tête d'authentification `Authorization: Bearer <token>`.
- La désérialisation transparente des montants financiers Guinéens (`BigInt` représentés en chaînes).
- La gestion optimisée du cache et des invalidations via **TanStack Query v5**.

