# 👩‍🌾 Module Producers & Credit Scoring — Documentation & Architecture

## 1. Responsabilité
Gère les profils des productrices rurales (souvent analphabètes et sans smartphone), leurs tuteurs de confiance, leurs groupements coopératifs, ainsi que leur historique de transactions servant de fondation pour le futur scoring de crédit agricole.

## 2. Entités & Relations
- **`Producer`** : Lié à `Village`, `User` (`registeredById` - agent local responsable), `Offer`, `ProducerPayout`, `Review`.
- Métriques d'historique : `salesHistoryCount`, `totalEarningsGnf`, `reliabilityScore` (0.0 à 100.0).

## 3. Endpoints REST

| Méthode | Route | Accès | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/producers` | AGENT, ADMIN | Enregistrement d'une nouvelle productrice par l'agent local (gère clé d'idempotence). |
| `GET` | `/api/v1/producers` | AGENT, ADMIN | Liste paginée avec filtres (`villageId`, `prefectureId`, `cooperative`). |
| `GET` | `/api/v1/producers/:id` | Authentifié | Profil complet, historique des lots vendus, score et avis reçus. |
| `PATCH` | `/api/v1/producers/:id`| AGENT, ADMIN | Mise à jour du profil, numéro de tuteur ou statut coopérative. |
| `POST` | `/api/v1/producers/:id/photo` | AGENT, ADMIN | Téléversement du portrait de la productrice vers MinIO (`sene-producers`). |

## 4. Algorithme de Fiabilité (Scoring Pilote)
Le `reliabilityScore` commence à 50/100 lors de l'enregistrement initial :
- **+5 points** pour chaque lot livré conforme en poids et qualité dans les délais.
- **-10 points** en cas d'annulation non justifiée ou de refus de marchandise au contrôle de pesée.
- **+2 points** par palier de 10 000 000 GNF de ventes cumulées.
Ce score est exposé aux institutions de micro-finance partenaires pour l'octroi d'intrants et de crédits de campagne.

