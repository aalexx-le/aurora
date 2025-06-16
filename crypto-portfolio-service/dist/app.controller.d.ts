import { ClientKafka, KafkaContext } from "@nestjs/microservices";
import { PrismaService } from "nestjs-prisma";
import { PortfolioCreationService } from "./services/portfolio-creation.service";
interface CreatePortfolioPayload {
    userId: number;
    executionId: number;
    exchanges: string;
    apiKey: string;
    secretKey: string;
    passphrase?: string;
    sandbox?: boolean;
}
export declare class AppController {
    private readonly kafkaClient;
    private readonly prisma;
    private readonly portfolioCreationService;
    private readonly logger;
    constructor(kafkaClient: ClientKafka, prisma: PrismaService, portfolioCreationService: PortfolioCreationService);
    handlePortfolioCreation(payload: CreatePortfolioPayload, context: KafkaContext): Promise<void>;
    handlePortfolioRetry(payload: {
        userId: number;
        executionId: number;
        currentRetryCount: number;
        timestamp: string;
    }, context: KafkaContext): Promise<void>;
    handleCredentialUpdate(payload: {
        userId: number;
        executionId: number;
        apiKey: string;
        secretKey: string;
        passphrase?: string;
        timestamp: string;
    }, context: KafkaContext): Promise<void>;
}
export {};
