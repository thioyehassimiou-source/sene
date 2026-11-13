# 📲 Module Offline Sync Engine — Documentation & Architecture

## 1. Responsabilité
Moteur central de synchronisation pour l'application mobile Flutter des agents de terrain opérant en zone blanche villageoise. Garantit le traitement strictement idempotent des actions enregistrées hors-ligne et réconcilie les éventuels conflits avec l'état de la base centrale.

## 2. Entités & Relations
- **`SyncMutationQueue`** : Table d'audit et de journalisation des actions mobiles avec `idempotencyKey` unique (UUIDv4 généré sur le terminal mobile), `entityType`, `actionType`, `payload` (JSONB) et `status` (`PENDING`, `APPLIED`, `REJECTED`, `CONFLICT`).

## 3. Endpoints REST

| Méthode | Route | Accès | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/sync/batch` | AGENT | Envoi groupé d'actions créées hors-ligne (productrices créées, pesées enregistrées). |
| `GET` | `/api/v1/sync/pull` | AGENT | Récupération delta des données mises à jour depuis `?since=` (horodatage ISO). |

## 4. Format des Mutations Hors-Ligne (Payload)
Chaque action envoyée par l'application Flutter contient :
```json
{
  "idempotencyKey": "a5e8c1d2-9b34-4a21-86f7-41e892cfa712",
  "clientTimestamp": "2026-11-13T16:45:00Z",
  "entityType": "OFFER",
  "actionType": "CREATE",
  "payload": {
    "producerId": "PRD-LAB-0042",
    "productId": "POTATO_TIMBI",
    "quantityTotal": 80,
    "unit": "SAC_50KG",
    "unitPriceGnf": "350000",
    "villageCollectionPoint": "Magasin Coopérative Bantignel"
  }
}
```

## 5. Stratégie de Résolution des Conflits
1. **Création d'entités (Productrices, Récoltes) :** Pas de conflit. L'entité est insérée avec l'UUID fourni par le client.
2. **Concurrence sur les Stocks :** Le serveur fait foi (*Server-Authoritative*). Si deux agents réservent le même lot de stock, la première requête validée est acceptée, la seconde reçoit une erreur `CONFLICT_INSUFFICIENT_STOCK`.
3. **Mises à jour biographiques :** Stratégie *Last-Write-Wins* basée sur l'horodatage client et serveur avec traçabilité dans `AuditLog`.

