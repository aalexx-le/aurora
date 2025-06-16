import { Balance } from "ccxt";
import { ExchangeInfo, PortfolioAsset } from "../shared/interfaces/portfolio-types.interface";
import { PnLCalculationService } from "./pnl-calculation.service";
import { PortfolioAnalyticsService } from "./portfolio-analytics.service";
import { PortfolioExchangeService } from "./portfolio-exchange.service";
import { PortfolioProgressService } from "./portfolio-progress.service";
interface CreatePortfolioPayload {
    userId: number;
    executionId: number;
    name?: string;
    exchanges: string;
    apiKey: string;
    secretKey: string;
    passphrase?: string;
}
interface RetryPortfolioPayload {
    userId: number;
    executionId: number;
    name?: string;
    exchanges?: string;
    apiKey?: string;
    secretKey?: string;
    passphrase?: string;
}
interface UpdateCredentialsPayload {
    userId: number;
    executionId: number;
    apiKey: string;
    secretKey: string;
    passphrase?: string;
    name?: string;
    exchanges?: string;
}
interface CreatePortfolioResult {
    portfolioId: string;
    balances: Balance[];
    assets: PortfolioAsset[];
    exchangeInfo?: ExchangeInfo;
}
export declare class PortfolioCreationService {
    private readonly portfolioExchangeService;
    private readonly portfolioProgressService;
    private readonly pnlCalculationService;
    private readonly portfolioAnalyticsService;
    private readonly logger;
    constructor(portfolioExchangeService: PortfolioExchangeService, portfolioProgressService: PortfolioProgressService, pnlCalculationService: PnLCalculationService, portfolioAnalyticsService: PortfolioAnalyticsService);
    createPortfolio(payload: CreatePortfolioPayload): Promise<CreatePortfolioResult>;
    private validateExchange;
    private decryptCredentials;
    private testExchangeConnection;
    private fetchAccountBalances;
    private processBalances;
    private createPortfolioRecord;
    private storeAssetBalances;
    private getSupportedExchangesList;
    retryPortfolioCreation(payload: RetryPortfolioPayload): Promise<CreatePortfolioResult>;
    updatePortfolioCredentials(payload: UpdateCredentialsPayload): Promise<CreatePortfolioResult>;
    private buildCompletePayloadFromExecution;
    private transformBalancesToAssets;
    private processSymbolDiscovery;
    private processTradeHistoryFetch;
    private processPriceHistoryFetch;
    private processPnLCalculation;
    private processAnalyticsCalculation;
    private storeComputedData;
}
export {};
