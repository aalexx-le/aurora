import { ClientKafka } from "@nestjs/microservices";
import { PrismaService } from "nestjs-prisma";
import { CreatePortfolioExecution, ErrorRecoveryAction, Exchanges, PortfolioCreationMilestone, PortfolioCreationStep } from "src/entities/prisma";
import { AssetPnLData, EnhancedTrade, PnLCalculationResult, PortfolioAnalyticsResult, SymbolDiscoveryResult } from "src/shared/interfaces/portfolio-types.interface";
interface ProgressUpdate {
    executionId: number;
    currentStep?: PortfolioCreationStep;
    currentMilestone?: PortfolioCreationMilestone;
    progressPercent?: number;
    errorMessage?: string;
    recoveryAction?: ErrorRecoveryAction;
    retryCount?: number;
    exchangeType?: Exchanges;
    executionContext?: any;
    completedAt?: Date;
}
export interface PortfolioData {
    userId: number;
    name: string;
    exchanges: Exchanges;
    apiKey: string;
    secretKey: string;
    passphrase?: string;
    investmentCategoryName?: string;
}
interface AssetBalanceData {
    assetInfoId: string;
    balance: number;
    locked: number;
}
export declare class PortfolioProgressService {
    private readonly prisma;
    private readonly kafkaClient;
    private readonly logger;
    private readonly milestoneMap;
    constructor(prisma: PrismaService, kafkaClient: ClientKafka);
    startStep(executionId: number, step: PortfolioCreationStep, exchangeType?: Exchanges): Promise<void>;
    completeStep(executionId: number, step: PortfolioCreationStep): Promise<void>;
    failStep(executionId: number, step: PortfolioCreationStep, error: Error): Promise<void>;
    markSuccess(executionId: number, portfolioId?: string, userId?: number, exchangeId?: string): Promise<void>;
    getProgress(executionId: number): Promise<{
        executionId: number;
        currentStep: import(".prisma/client").$Enums.PortfolioCreationStep;
        milestone: import(".prisma/client").$Enums.PortfolioCreationMilestone;
        progressPercent: number;
        errorMessage: string;
        recoveryAction: import(".prisma/client").$Enums.ErrorRecoveryAction;
        retryCount: number;
        maxRetries: number;
    }>;
    updateProgress(updates: ProgressUpdate): Promise<CreatePortfolioExecution>;
    markAsFailed(executionId: number, errorMessage: string, recoveryAction: ErrorRecoveryAction, currentStep?: PortfolioCreationStep, milestone?: PortfolioCreationMilestone): Promise<CreatePortfolioExecution>;
    incrementRetryCount(executionId: number): Promise<CreatePortfolioExecution>;
    getExecution(executionId: number): Promise<{
        id: number;
        userId: number;
        currentStep: import(".prisma/client").$Enums.PortfolioCreationStep | null;
        currentMilestone: import(".prisma/client").$Enums.PortfolioCreationMilestone | null;
        progressPercent: number;
        errorMessage: string | null;
        recoveryAction: import(".prisma/client").$Enums.ErrorRecoveryAction | null;
        retryCount: number;
        maxRetries: number;
        exchangeType: import(".prisma/client").$Enums.Exchanges | null;
        executionContext: import("@prisma/client/runtime/library").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        completedAt: Date | null;
    }>;
    createPortfolio(portfolioData: PortfolioData): Promise<string>;
    upsertAssetBalances(portfolioId: string, balances: AssetBalanceData[]): Promise<void>;
    findOrCreateAssetInfo(symbol: string): Promise<string>;
    storeComputedPortfolioData(portfolioId: string, data: {
        trades: EnhancedTrade[];
        assetPnLData: AssetPnLData[];
        portfolioAnalytics: PortfolioAnalyticsResult;
        portfolioPnL: PnLCalculationResult;
    }): Promise<void>;
    storeSymbolDiscoveryData(portfolioId: string, symbolDiscoveryResult: SymbolDiscoveryResult): Promise<void>;
    storeTradeHistoryData(portfolioId: string, trades: EnhancedTrade[]): Promise<void>;
    storePriceHistoryData(portfolioId: string, currentPrices: Map<string, number>): Promise<void>;
    storePnLCalculationData(portfolioId: string, pnlResult: PnLCalculationResult): Promise<void>;
    storeAnalyticsData(portfolioId: string, analyticsResult: PortfolioAnalyticsResult, portfolioPnL: PnLCalculationResult): Promise<void>;
    private generateUUID;
    private analyzeError;
    private publishProgressEvent;
}
export {};
