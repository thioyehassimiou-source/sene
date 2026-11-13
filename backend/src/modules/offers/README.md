# 🌾 Module Offers — Documentation & Architecture

## 1. Responsabilité
Permet aux agents locaux de publier des lots de récoltes disponibles pour le compte des productrices, avec photos des sacs/caisses, prix en Francs Guinéens (GNF), grade de qualité et calendrier de disponibilité.

## 2. Entités & Relations
- **`Offer`** : Liée à `Producer`, `User` (Agent responsable), `Product`, `OrderItem`.
- Champs clés : `quantityTotal`, `quantityAvailable`, `unitPriceGnf` (BigInt), `qualityGrade` (`GRADE_A`, `GRADE_B`, `STANDARD`), `season` (`DRY_SEASON`, `RAINY_SEASON`), `photos` (URLs MinIO).

## 3. Endpoints REST

| Méthode | Route | Accès | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/offers` | AGENT, ADMIN | Création d'une offre avec photos de récolte et point de collecte villageois. |
| `GET` | `/api/v1/offers` | Public / Acheteur | Recherche et consultation des récoltes disponibles (filtres: produit, région, prix, grade). |
| `GET` | `/api/v1/offers/:id` | Public | Détails du lot, localisation du magasin de groupage et stock restant. |
| `PATCH` | `/api/v1/offers/:id/status` | AGENT, ADMIN | Mise à jour du statut (`PUBLISHED`, `RESERVED`, `SOLD_OUT`, `EXPIRED`). |

## 4. Règles de Gestion des Stocks
- Les stocks disponibles sont décrémentés lors de la confirmation d'une commande acheteur dans une transaction atomique.
- Si une commande est annulée avant l'expédition du corridor, le stock réservé est automatiquement réintégré à l'offre.

