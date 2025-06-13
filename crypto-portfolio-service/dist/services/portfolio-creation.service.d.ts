import { Balance } from "ccxt";
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
    assets: any[];
    exchangeInfo?: any;
}
export declare class PortfolioCreationService {
    private readonly portfolioExchangeService;
    private readonly portfolioProgressService;
    private readonly logger;
    constructor(portfolioExchangeService: PortfolioExchangeService, portfolioProgressService: PortfolioProgressService);
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
}
export {};
