# 📊 Frontend Development Kanban Board — Sènè Back-Office

> **Interactive Checklist & Feature Delivery Tracker for Next.js Admin & Operations Cockpit**

---

## 📈 Global Progress Summary
- **Foundation & Infrastructure:** 100% (Next.js 14 App Router, Tailwind CSS, Lucide Icons, Standalone Dockerfile)
- **Design System & Shell:** 100% (Sidebar avec compteur, Header de statut, Layout adaptatif)
- **Dashboard Cockpit Pilote:** 100% (4 KPIs, tableau de suivi des convois du corridor Labé ➔ Conakry)
- **Business Views Implementation:** In Progress (Roadmap ci-dessous)

---

## 📋 Kanban Board

| 🎯 Backlog | 🚧 In Progress | 🧪 Testing & Review | ✅ Done |
| :--- | :--- | :--- | :--- |
| • Vue détaillée des Productrices & Scoring | • Étape 3 : Intégration des DTOs partagés | • Dockerfile Multi-stage Standalone | • Initialisation Next.js 14 App Router |
| • Module de passage de commande grossiste | • Client API Axios / TanStack Query v5 | • Palette graphique agricole Sènè | • Configuration Tailwind CSS & PostCSS |
| • Visualisation cartographique du corridor | | • Statut de connectivité MinIO/Postgres | • Composant Shell Sidebar & Header |
| • Module de décaissage Mobile Money | | • Composant KPI Card réutilisable | • Tableau de bord principal des opérations |

---

## 🗂️ Feature-by-Feature Checklist

### 1. 🎛️ Shell & Navigation
- [x] Structure de mise en page globale (`src/app/layout.tsx`)
- [x] Barre latérale de navigation avec badges de compteurs (`src/components/Sidebar.tsx`)
- [x] Indicateur d'état de la file de synchronisation offline
- [x] En-tête avec barre de recherche rapide et badge de santé des services (`src/components/Header.tsx`)
- [ ] Mode sombre / contraste élevé pour utilisation en extérieur

---

### 2. 👩‍🌾 Annuaire des Productrices & Scoring (`/producers`)
- [ ] Table interactive des productrices avec filtres par préfecture (Pita, Labé, Dinguiraye)
- [ ] Badge visuel du `reliabilityScore` (Code couleur vert/jaune/rouge)
- [ ] Fiche détaillée d'une productrice avec affichage du tuteur et photo MinIO
- [ ] Historique cumulé des ventes en Francs Guinéens (GNF)
- [ ] Modal d'ajout rapide d'une productrice

---

### 3. 🥔 Gestion des Récoltes & Offres (`/offers`)
- [ ] Galerie des lots publiés avec photos MinIO et grade de qualité (A, B, Standard)
- [ ] Jauge de stock disponible vs stock réservé
- [ ] Formulaire de publication d'une offre avec saisie du point de collecte villageois
- [ ] Filtre par saison agricole (Saison sèche / Saison des pluies)

---

### 4. 🚚 Suivi Logistique du Corridor (`/logistics`)
- [x] Tableau récapitulatif des expéditions en cours (origines, destinations, camions)
- [ ] Fiche de convoi avec affichage du ticket de pont-bascule hébergé sur MinIO
- [ ] Validation de passage aux points de contrôle (Mamou, Kindia, Coyah)
- [ ] Interface d'émargement et signature de réception de l'acheteur

---

### 5. 💳 Gestion du Séquestre & Décaissages (`/escrow`)
- [ ] Solde total des fonds sous séquestre par opérateur (Orange Money / MTN MoMo)
- [ ] Liste des commandes en attente de libération de fonds
- [ ] Validation des décaissages en espèces aux agents locaux avec photo de la quittance émargée
- [ ] Export comptable CSV des règlements productrices

