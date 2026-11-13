# 🛒 Module Orders — Documentation & Architecture

## 1. Responsabilité
Gère les commandes d'achat passées par les grossistes, restaurateurs ou particuliers de Conakry, la réservation immédiate de stock, et la ventilation comptable des montants (brut, commissions, net productrice).

## 2. Entités & Relations
- **`Order`** : Liée à `User` (Acheteur), `OrderItem` (détail des lots), `Delivery` (logistique), `Payment` (séquestre), `ProducerPayout`.
- Montants en Francs Guinéens (GNF) : `totalAmountGnf`, `platformCommissionGnf` (ex: 5%), `agentCommissionGnf` (ex: 3%), `producerNetTotalGnf` (92%).

## 3. Endpoints REST

| Méthode | Route | Accès | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/orders` | BUYER, ADMIN | Création de commande avec adresse de livraison à Conakry et réservation de stock atomique. |
| `GET` | `/api/v1/orders` | Authentifié | Liste des commandes (acheteurs voient les leurs, agents voient celles de leur zone, admins voient tout). |
| `GET` | `/api/v1/orders/:id` | Authentifié | Fiche détaillée de la commande avec état d'avancement du transport. |
| `POST` | `/api/v1/orders/:id/cancel` | BUYER, ADMIN | Annulation avec déverrouillage immédiat des stocks réservés. |

## 4. Statuts de Commande
- `PENDING` : En attente de paiement séquestre Mobile Money.
- `CONFIRMED` : Paiement séquestré validé.
- `COLLECTING` : En cours de pesée et de collecte au village par l'agent.
- `IN_TRANSIT` : Camion en route sur le corridor (ex: Labé ➔ Conakry).
- `DELIVERED` : Arrivée et vérification au marché de Conakry.
- `COMPLETED` : Réception confirmée par l'acheteur et fonds décaissés.

