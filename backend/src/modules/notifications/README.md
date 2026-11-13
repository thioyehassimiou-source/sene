# 📢 Module Notifications — Documentation & Architecture

## 1. Responsabilité
Diffuse les alertes critiques aux acteurs du corridor par SMS (pour les téléphones basiques des productrices et transporteurs) et par WhatsApp (pour les acheteurs urbains et les agents équipés de smartphones).

## 2. Entités & Relations
- **`NotificationLog`** : Audit trail de chaque message envoyé (`recipientPhone`, `channel`, `templateCode`, `status`, `providerName`, `providerMessageId`).

## 3. Endpoints REST & Tâches Internes
Le module opère principalement en interne via des événements de domaine ou via la file asynchrone Redis / BullMQ :
- Événement `ORDER_CREATED` ➔ SMS de réservation envoyé à l'agent local.
- Événement `DELIVERY_DISPATCHED` ➔ WhatsApp avec estimation d'arrivée envoyé à l'acheteur.
- Événement `PAYOUT_DISBURSED` ➔ SMS de confirmation au tuteur de la productrice.

## 4. Architecture Abstraite des Fournisseurs
L'interface `NotificationProvider` permet l'interchangeabilité :
```typescript
export interface NotificationProvider {
  readonly providerName: string;
  readonly supportedChannel: NotificationChannel;
  sendNotification(dto: SendNotificationDto): Promise<NotificationResult>;
}
```
Fournisseurs supportés :
- `OrangeSmsGuineeProvider` : API SMS locale d'Orange Guinée (expéditeur `SENE`).
- `MetaWhatsAppProvider` : WhatsApp Cloud API (templates approuvés par Meta).
- `MockNotificationProvider` : Journalisation console pour les tests et le développement local.

