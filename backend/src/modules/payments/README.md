# 💳 Module Payments & Escrow Ledger — Documentation & Architecture

## 1. Responsabilité
Gère les flux financiers de bout-en-bout avec séquestre (*escrow*) : encaissement sécurisé auprès des acheteurs urbains via Mobile Money (Orange Money Guinée, MTN MoMo) ou paiement à la livraison (COD), verrouillage des fonds jusqu'à réception conforme, puis décaissage net vers la productrice rurale et versement des commissions.

## 2. Entités & Relations
- **`Payment`** : Lié à `Order`, statut du séquestre (`ESCROW_LOCKED`, `RELEASED_TO_PRODUCER`, `REFUNDED`).
- **`ProducerPayout`** : Lié à `Producer`, `Order`, `Payment`. Détail du montant brut, de la commission plateforme, de la commission agent et du net décaissé.

## 3. Endpoints REST

| Méthode | Route | Accès | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/payments/initiate` | BUYER, ADMIN | Déclenchement de l'invite de paiement Mobile Money (USSD push ou QR). |
| `POST` | `/api/v1/payments/webhook/:provider` | Système/IPN | Webhook de validation de paiement émis par l'opérateur télécom. |
| `POST` | `/api/v1/payments/release-escrow/:orderId` | ADMIN, Système | Libération automatique des fonds sous séquestre suite à la livraison. |
| `POST` | `/api/v1/payments/disburse-payout` | AGENT, ADMIN | Validation d'un décaissage liquide en main propre au village avec photo du reçu émargé. |

## 4. Architecture Abstraite des Fournisseurs
Le module implémente l'interface `PaymentProvider` :
```typescript
export interface PaymentProvider {
  readonly providerName: string;
  readonly supportedMethod: PaymentMethod;
  initiatePayment(dto: InitiatePaymentDto): Promise<PaymentInitiationResult>;
  verifyPayment(providerTransactionId: string): Promise<VerifyPaymentResult>;
  disbursePayout?(dto: DisbursePayoutDto): Promise<DisbursePayoutResult>;
}
```
Les implémentations (`OrangeMoneyProvider`, `MtnMomoProvider`, `CashOnDeliveryProvider`, `MockPaymentProvider`) sont instanciées via une fabrique (*factory*) selon la méthode choisie.

