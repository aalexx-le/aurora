import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { PrismaModule } from "nestjs-prisma";
import { AppController } from "./app.controller";
import { PnLCalculationService } from "./services/pnl-calculation.service";
import { PortfolioAnalyticsService } from "./services/portfolio-analytics.service";

import { PortfolioCreationService } from "./services/portfolio-creation.service";
import { PortfolioExchangeService } from "./services/portfolio-exchange.service";
import { PortfolioProgressService } from "./services/portfolio-progress.service";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule.forRoot({
            isGlobal: true,
            prismaServiceOptions: {
                prismaOptions: {
                    log: ["info", "warn", "error"],
                },
                explicitConnect: true,
            },
        }),
        ClientsModule.registerAsync([
            {
                name: "KAFKA_SERVICE",
                inject: [ConfigService],
                useFactory: async (configService: ConfigService) => {
                    const broker = configService.get("MESSAGE_BROKER_URL");
                    return {
                        transport: Transport.KAFKA,
                        options: {
                            client: {
                                clientId: "crypto-portfolio-service",
                                brokers: [broker],
                            },
                            consumer: {
                                groupId: "crypto-portfolio-consumer",
                                allowAutoTopicCreation: true,
                            },
                            producer: {
                                allowAutoTopicCreation: true,
                            },
                        },
                    };
                },
            },
        ]),
    ],
    controllers: [AppController],
    providers: [
        PortfolioCreationService,
        PortfolioExchangeService,
        PortfolioProgressService,
        PnLCalculationService,
        PortfolioAnalyticsService,
    ],
})
export class AppModule {}
