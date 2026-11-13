# 📦 Documentation des Modules & Vues du Front-Office — Sènè Platform

---

## 1. Module Dashboard (`/`)
- **Rôle :** Vue d'ensemble stratégique pour le directeur des opérations et les superviseurs de zone.
- **Indicateurs clés affichés :**
  - Nombre total de productrices actives dans les villages pilotes.
  - Tonnage total de récoltes acheminées et pertes post-récolte constatées (< 2%).
  - Volume de trésorerie sous séquestre Mobile Money (Orange Money / MTN MoMo).
  - Statut en temps réel des camions et convois circulant sur la nationale Labé/Dinguiraye ➔ Conakry.

---

## 2. Module Productrices (`/producers`)
- **Rôle :** Gestion des fiches productrices avec contact du tuteur, photo d'identité hébergée sur MinIO et score de fiabilité.
- **Actions disponibles :**
  - Filtrage multi-critères par préfecture (Labé, Pita, Dinguiraye), sous-préfecture et coopérative.
  - Consultation de la courbe d'évolution du score de fiabilité.
  - Export PDF de la fiche productrice pour les partenaires de micro-crédit.

---

## 3. Module Récoltes & Offres (`/offers`)
- **Rôle :** Consultation du catalogue d'approvisionnement destiné aux acheteurs urbains (restaurateurs et grossistes).
- **Actions disponibles :**
  - Visualisation des photos de lots prises par les agents de terrain.
  - Sélection des qualités : Grade A (Calibre premier choix), Grade B (Calibre standard).
  - Suivi de la disponibilité temporelle du lot (date de récolte et date limite de conservation).

---

## 4. Module Logistique du Corridor (`/logistics`)
- **Rôle :** Suivi physique des chargements et des chauffeurs.
- **Actions disponibles :**
  - Visualisation du ticket de pont-bascule numérisé pour comparaison avec le bon de commande.
  - Suivi des heures de départ du Fouta Djallon et d'arrivée aux points de débarquement (Madina, Entag).
  - Validation de la signature numérique de décharge lors de la remise des marchandises.

---

## 5. Module Trésorerie & Séquestre (`/escrow`)
- **Rôle :** Contrôle financier des fonds bloqués et des règlements aux productrices.
- **Actions disponibles :**
  - Déclenchement ou validation des ordres de décaissage liquide en zone rurale.
  - Téléversement et archivage des reçus de décharge signés ou marqués par empreinte digitale.

