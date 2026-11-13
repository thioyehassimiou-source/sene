import { PaymentMethod } from '@prisma/client';

export interface InitiatePaymentDto {
  orderId: string;
  orderNumber: string;
  amountGnf: bigint;
  customerPhone: string;
  customerName: string;
  callbackUrl?: string;
}

export interface PaymentInitiationResult {
  success: boolean;
  transactionReference: string;
  providerTransactionId?: string;
  paymentUrl?: string;
  ussdPromptSent?: boolean;
  message: string;
  rawResponse?: Record<string, any>;
}

export interface VerifyPaymentResult {
  isSuccessful: boolean;
  providerTransactionId: string;
  amountPaidGnf: bigint;
  paidAt?: Date;
  statusText: string;
  rawResponse?: Record<string, any>;
}

export interface DisbursePayoutDto {
  payoutReference: string;
  recipientPhone: string;
  recipientName: string;
  netAmountGnf: bigint;
  reason: string;
}

export interface DisbursePayoutResult {
  isSuccess: boolean;
  providerTransferId?: string;
  message: string;
  rawResponse?: Record<string, any>;
}

export interface PaymentProvider {
  readonly providerName: string;
  readonly supportedMethod: PaymentMethod;

  initiatePayment(dto: InitiatePaymentDto): Promise<PaymentInitiationResult>;
  verifyPayment(providerTransactionId: string): Promise<VerifyPaymentResult>;
  disbursePayout?(dto: DisbursePayoutDto): Promise<DisbursePayoutResult>;
}

