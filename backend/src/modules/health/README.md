# 🩺 Module Health — Documentation & Architecture

## 1. Responsabilité
Expose des sondes de disponibilité et d'état de santé pour les orchestrateurs de conteneurs (Docker Compose, Kubernetes) et les outils de supervision (Uptime Kuma, Datadog).

## 2. Endpoints

| Méthode | Route | Accès | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Public | Vérifie l'état de la connexion PostgreSQL, Redis et MinIO. Retourne `200 OK` si opérationnel, `503 Service Unavailable` si dégradé. |

## 3. Format de Réponse
```json
{
  "status": "ok",
  "timestamp": "2026-11-13T19:00:00.000Z",
  "services": {
    "database": "up",
    "api": "up"
  },
  "uptime": 142.5
}
```

