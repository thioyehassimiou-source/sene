import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadBucketCommand,
  CreateBucketCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private s3Client: S3Client;
  private readonly defaultBucket: string;

  constructor(private readonly config: ConfigService) {
    const endpoint = this.config.get<string>('MINIO_ENDPOINT', 'localhost');
    const port = this.config.get<number>('MINIO_PORT', 9000);
    const useSsl = this.config.get<string>('MINIO_USE_SSL', 'false') === 'true';
    const protocol = useSsl ? 'https' : 'http';

    this.defaultBucket = this.config.get<string>('MINIO_BUCKET_CROPS', 'sene-crops');

    this.s3Client = new S3Client({
      endpoint: `${protocol}://${endpoint}:${port}`,
      region: 'us-east-1', // MinIO requires a region string
      credentials: {
        accessKeyId: this.config.get<string>('MINIO_ACCESS_KEY', 'sene_minio_admin'),
        secretAccessKey: this.config.get<string>('MINIO_SECRET_KEY', 'sene_minio_password_2026'),
      },
      forcePathStyle: true, // Necessary for MinIO
    });
  }

  async onModuleInit() {
    this.logger.log('Initializing MinIO Object Storage connection...');
    await this.ensureBucketExists(this.defaultBucket);
  }

  async ensureBucketExists(bucketName: string): Promise<void> {
    try {
      await this.s3Client.send(new HeadBucketCommand({ Bucket: bucketName }));
      this.logger.log(`✅ MinIO Bucket verified: ${bucketName}`);
    } catch {
      try {
        await this.s3Client.send(new CreateBucketCommand({ Bucket: bucketName }));
        this.logger.log(`Created MinIO Bucket: ${bucketName}`);
      } catch (err) {
        this.logger.warn(`Could not verify/create MinIO bucket ${bucketName}: ${(err as Error).message}`);
      }
    }
  }

  async uploadFile(
    bucket: string,
    key: string,
    body: Buffer,
    contentType: string,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    await this.s3Client.send(command);

    const endpoint = this.config.get<string>('MINIO_ENDPOINT', 'localhost');
    const port = this.config.get<number>('MINIO_PORT', 9000);
    const useSsl = this.config.get<string>('MINIO_USE_SSL', 'false') === 'true';
    const protocol = useSsl ? 'https' : 'http';

    return `${protocol}://${endpoint}:${port}/${bucket}/${key}`;
  }

  async getPresignedUploadUrl(bucket: string, key: string, expiresIn = 3600): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async getPresignedDownloadUrl(bucket: string, key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    return getSignedUrl(this.s3Client, command, { expiresIn });
  }
}

