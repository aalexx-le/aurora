"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const microservices_1 = require("@nestjs/microservices");
const nestjs_prisma_1 = require("nestjs-prisma");
const app_controller_1 = require("./app.controller");
const pnl_calculation_service_1 = require("./services/pnl-calculation.service");
const portfolio_analytics_service_1 = require("./services/portfolio-analytics.service");
const portfolio_creation_service_1 = require("./services/portfolio-creation.service");
const portfolio_exchange_service_1 = require("./services/portfolio-exchange.service");
const portfolio_progress_service_1 = require("./services/portfolio-progress.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            nestjs_prisma_1.PrismaModule.forRoot({
                isGlobal: true,
                prismaServiceOptions: {
                    prismaOptions: {
                        log: ["info", "warn", "error"],
                    },
                    explicitConnect: true,
                },
            }),
            microservices_1.ClientsModule.registerAsync([
                {
                    name: "KAFKA_SERVICE",
                    inject: [config_1.ConfigService],
                    useFactory: async (configService) => {
                        const broker = configService.get("MESSAGE_BROKER_URL");
                        return {
                            transport: microservices_1.Transport.KAFKA,
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
        controllers: [app_controller_1.AppController],
        providers: [
            portfolio_creation_service_1.PortfolioCreationService,
            portfolio_exchange_service_1.PortfolioExchangeService,
            portfolio_progress_service_1.PortfolioProgressService,
            pnl_calculation_service_1.PnLCalculationService,
            portfolio_analytics_service_1.PortfolioAnalyticsService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map