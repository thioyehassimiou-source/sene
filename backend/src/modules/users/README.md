# 👤 Module Users — Documentation & Architecture

## 1. Responsabilité
Gère les profils utilisateurs, les affectations géographiques des agents locaux (préfectures assignées), les profils d'acheteurs (restaurants, grossistes) et le contrôle d'accès basé sur les rôles (RBAC).

## 2. Entités & Relations
- **`User`** : Lié à `Prefecture` (`assignedPrefectureId`), `Producer` (`registeredProducers`), `Offer` (`publishedOffers`), `Order` (`buyerOrders`).

## 3. Endpoints REST

| Méthode | Route | Accès | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/users/me` | Authentifié | Retourne le profil complet et les permissions de l'utilisateur connecté. |
| `PATCH` | `/api/v1/users/me` | Authentifié | Mise à jour du nom, avatar ou coordonnées. |
| `GET` | `/api/v1/users/agents` | ADMIN | Liste de tous les agents locaux avec leur préfecture d'affectation et badge code. |
| `POST` | `/api/v1/users/agents` | ADMIN | Création et affectation d'un nouvel agent local. |

## 4. Règles Métier
- Un agent local doit obligatoirement posséder un code de badge unique (ex. `AGT-2026-LAB-01`) et être rattaché à une préfecture.
- Seul un administrateur peut modifier le rôle ou désactiver un compte agent.

