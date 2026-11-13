import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  // Security: HTTP headers protection
  app.use(
    helmet({
      contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  // Security: CORS configuration
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
    : ['http://localhost:3000'];

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Idempotency-Key'],
  });

  // Global Prefix: /api/v1
  app.setGlobalPrefix('api/v1', {
    exclude: ['metrics', 'health'],
  });

  // Global Input Validation & Sanitization
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global Filters & Interceptors
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  // OpenAPI / Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Sènè API - Agricultural Platform Guinea')
    .setDescription(
      'Enterprise REST API connecting Guinean rural producers to urban buyers via local agents. Supports offline-first mobile sync, mobile money escrow, and corridor logistics tracking.',
    )
    .setVersion('1.0.0')
    .addTag('Health & Monitoring', 'Service health checks and Prometheus metrics')
    .addTag('Authentication', 'JWT and phone OTP authentication')
    .addTag('Users', 'User management and administrative roles')
    .addTag('Localities', 'Administrative geographic hierarchy (Region > Prefecture > SubPrefecture > Village)')
    .addTag('Producers', 'Rural women farmers managed by local agents')
    .addTag('Products', 'Crops and agricultural goods catalog')
    .addTag('Offers', 'Harvest supply batches published by agents')
    .addTag('Orders', 'Buyer purchases, stock reservation, and status lifecycle')
    .addTag('Logistics', 'Village collection, weighbridge verification, and corridor transit')
    .addTag('Payments', 'Abstract payment gateway (Orange Money GN, MTN MoMo, Escrow)')
    .addTag('Offline Sync', 'Offline mutation queue, idempotency, and conflict resolution')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter your JWT access token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'method',
    },
    customSiteTitle: 'Sènè API Documentation',
  });

  // Graceful shutdown hooks
  app.enableShutdownHooks();

  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`🚀 Sènè Modular API is running on: http://localhost:${port}/api/v1`);
  logger.log(`📚 Interactive Swagger Docs available at: http://localhost:${port}/api/docs`);
  logger.log(`📊 Prometheus Metrics available at: http://localhost:${port}/metrics`);
}

bootstrap();

