# 🗺️ Module Localities — Documentation & Architecture

## 1. Responsabilité
Gère le découpage administratif et géographique officiel de la République de Guinée pour localiser les zones de production agricole, les points de collecte et les itinéraires du corridor logistique.

## 2. Entités & Relations
- **`Region`** : Niveau 1 (ex. Labé, Boké, Kindia, Conakry).
- **`Prefecture`** : Niveau 2 (ex. Labé, Pita, Dinguiraye).
- **`SubPrefecture`** : Niveau 3 (ex. Timbi-Madina, Timbi-Touni, Popodara).
- **`Village`** : Niveau 4 avec coordonnées GPS (`latitude`, `longitude`) et repères visuels (`landmarkNotes` : "Près du grand magasin", "À 5 km du pont").

## 3. Endpoints REST

| Méthode | Route | Accès | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/localities/regions` | Public | Liste des régions avec leur code unique. |
| `GET` | `/api/v1/localities/prefectures` | Public | Préfectures, filtrables par `?regionId=`. |
| `GET` | `/api/v1/localities/sub-prefectures`| Public | Sous-préfectures, filtrables par `?prefectureId=`. |
| `GET` | `/api/v1/localities/villages` | Public / Agent | Villages, filtrables par `?subPrefectureId=`. |
| `POST` | `/api/v1/localities/villages` | AGENT, ADMIN | Enregistrement d'un nouveau village ou point de groupage. |

## 4. Stratégie de Performance & Offline
- Ces données étant quasi-statiques, elles sont mises en cache Redis côté serveur (TTL 24 heures).
- Côté mobile, la hiérarchie géographique est entièrement préchargée dans la base SQLite locale pour permettre la saisie hors-ligne instantanée.

