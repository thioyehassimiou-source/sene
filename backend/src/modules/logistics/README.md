# 🚚 Module Logistics & Corridor — Documentation & Architecture

## 1. Responsabilité
Supervise la chaîne physique de transport depuis le village d'origine jusqu'aux marchés de destination à Conakry (Madina, Entag, Dixinn), en garantissant la vérification contradictoire du poids et de la qualité au chargement et au déchargement pour éliminer les pertes post-récolte.

## 2. Entités & Relations
- **`Delivery`** : Liée à `Order`, `User` (Agent collecteur responsable), tickets scannés sur MinIO (`weighbridgeTicketUrl`, `proofOfDeliveryUrl`).
- Données chauffeur : `driverName`, `driverPhone`, `vehiclePlate` (ex: `RC-4589-B`).

## 3. Endpoints REST

| Méthode | Route | Accès | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/logistics/deliveries` | AGENT, ADMIN | Création de la feuille d'expédition, assignation du camion et du chauffeur. |
| `PATCH` | `/api/v1/logistics/deliveries/:id/weighbridge` | AGENT | Saisie du poids effectif au pont-bascule et téléversement du ticket photo sur MinIO. |
| `PATCH` | `/api/v1/logistics/deliveries/:id/checkpoints`| AGENT, ADMIN | Enregistrement du passage aux checkpoints routiers (Mamou, Kindia, Coyah). |
| `POST` | `/api/v1/logistics/deliveries/:id/confirm-receipt` | BUYER, ADMIN | Émargement de réception par l'acheteur et validation finale. |

## 4. Prévention des Pertes Post-Récolte
1. **Contrôle initial au village :** L'agent vérifie le calibre, l'absence de pourriture et le taux d'humidité avant de sceller le lot.
2. **Ticket pont-bascule :** Photo prise sur place avec métadonnées horodatées pour interdire toute contestation sur le tonnage expédié.
3. **Surveillance des délais :** Alertes BullMQ automatiques si un convoi dépasse 24 heures de trajet entre Labé et Conakry.

