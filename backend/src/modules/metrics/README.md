# 📊 Module Metrics — Documentation & Architecture

## 1. Responsabilité
Expose les métriques système et applicatives au standard Prometheus pour l'analyse des performances, de la consommation mémoire et du débit de transactions.

## 2. Endpoints

| Méthode | Route | Accès | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/metrics` | Public / Scrape | Expose les métriques au format texte Prometheus (`text/plain`). |

## 3. Métriques Surveillées
- Métriques système standard (CPU, mémoire du processus Node.js, boucle d'événements).
- Compteurs de requêtes HTTP par méthode, route et code de statut.
- Latence des requêtes au 90e et 99e percentile.
- Métriques métier Sènè (`sene_sync_mutations_total`, `sene_orders_volume_gnf`).

