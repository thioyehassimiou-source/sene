# 🥔 Module Products — Documentation & Architecture

## 1. Responsabilité
Gère le catalogue officiel des produits et cultures agricoles commercialisés sur la plateforme Sènè (spécifications de variété, unités de conditionnement standardisées et catégories).

## 2. Entités & Relations
- **`Product`** : `code` (ex: `POTATO_TIMBI`, `FONIO_DINGUIRAYE`), `category` (`TUBER`, `CEREAL`, `VEGETABLE`), `defaultUnit` (`SAC_50KG`, `SAC_25KG`, `CAISSE`, `KG`), `iconUrl` sur MinIO.

## 3. Endpoints REST

| Méthode | Route | Accès | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/products` | Public | Liste des cultures actives disponibles sur la plateforme. |
| `GET` | `/api/v1/products/:id` | Public | Détails, calibre et unités recommandées pour une culture. |
| `POST` | `/api/v1/products` | ADMIN | Création d'une nouvelle variété agricole au catalogue. |

## 4. Cultures du Pilote
1. **Pomme de terre de Timbi-Madina (Pita/Labé)** : Sac de 50 kg, variété Belle de Guinée / Nicola, conditionnement aéré.
2. **Fonio de Dinguiraye** : Sac de 25 kg précuit ou décortiqué, conditionnement hermétique contre l'humidité.

