import { NotificationChannel } from '@prisma/client';

export interface SendNotificationDto {
  recipientPhone: string;
  channel: NotificationChannel;
  templateCode: string;
  templateVariables: Record<string, string | number>;
  fallbackMessage: string;
}

export interface NotificationResult {
  success: boolean;
  providerMessageId?: string;
  providerName: string;
  error?: string;
}

export interface NotificationProvider {
  readonly providerName: string;
  readonly supportedChannel: NotificationChannel;

  sendNotification(dto: SendNotificationDto): Promise<NotificationResult>;
}

