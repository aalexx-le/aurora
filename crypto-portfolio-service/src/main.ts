import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AsyncMicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('CryptoPortfolioService');
  
  // Create microservice with Kafka transport
  const app = await NestFactory.createMicroservice<AsyncMicroserviceOptions>(
    AppModule,
    {
      useFactory: (configService: ConfigService) => ({
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: configService.get("KAFKA_CLIENT_ID") || "crypto-portfolio-service",
            brokers: [configService.get("MESSAGE_BROKER_URL") || "localhost:9092"],
          },
          consumer: {
            groupId: configService.get("KAFKA_CONSUMER_GROUP_ID") || "crypto-portfolio-consumer",
            allowAutoTopicCreation: true,
          },
          producer: {
            allowAutoTopicCreation: true,
          },
        },
      }),
      inject: [ConfigService],
    },
  );
  
  await app.listen();
  logger.log('🚀 Crypto Portfolio Microservice is listening for Kafka messages');
}

bootstrap();
