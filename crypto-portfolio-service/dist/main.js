"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const microservices_1 = require("@nestjs/microservices");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const logger = new common_1.Logger("CryptoPortfolioService");
    const app = await core_1.NestFactory.createMicroservice(app_module_1.AppModule, {
        useFactory: (configService) => ({
            transport: microservices_1.Transport.KAFKA,
            options: {
                client: {
                    clientId: configService.get("KAFKA_CLIENT_ID") ||
                        "crypto-portfolio-service",
                    brokers: [
                        configService.get("MESSAGE_BROKER_URL") ||
                            "localhost:9092",
                    ],
                },
                consumer: {
                    groupId: configService.get("KAFKA_CONSUMER_GROUP_ID") ||
                        "crypto-portfolio-consumer",
                    allowAutoTopicCreation: true,
                },
                producer: {
                    allowAutoTopicCreation: true,
                },
            },
        }),
        inject: [config_1.ConfigService],
    });
    await app.listen();
    logger.log("🚀 Crypto Portfolio Microservice is listening for Kafka messages");
}
bootstrap();
//# sourceMappingURL=main.js.map