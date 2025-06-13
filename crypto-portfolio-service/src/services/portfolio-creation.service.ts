import { Injectable, Logger } from "@nestjs/common";
import { Balance } from "ccxt";
import { Exchanges, PortfolioCreationStep } from "src/entities/prisma";
import { PortfolioExchangeService } from "./portfolio-exchange.service";
import { PortfolioData, PortfolioProgressService } from "./portfolio-progress.service";

interface CreatePortfolioPayload {
    userId: number;
    executionId: number;
    name?: string;
    exchanges: string; // Will be normalized to lowercase for CCXT compatibility
    apiKey: string;
    secretKey: string;
    passphrase?: string;
}

interface RetryPortfolioPayload {
    userId: number;
    executionId: number;
    // Optional overrides
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
    // Optional context updates
    name?: string;
    exchanges?: string;
}

interface CreatePortfolioResult {
    portfolioId: string;
    balances: Balance[];
    assets: any[];
    exchangeInfo?: any;
}

interface PortfolioBalance {
    symbol: string;
    free: number;
    used: number;
    total: number;
    usdValue?: number;
}

@Injectable()
export class PortfolioCreationService {
    private readonly logger = new Logger(PortfolioCreationService.name);

    constructor(
        private readonly portfolioExchangeService: PortfolioExchangeService,
        private readonly portfolioProgressService: PortfolioProgressService,
    ) {
        this.logger.log(
            "🏗️ Portfolio Creation Service initialized with integrated services and enum-based progress tracking",
        );
    }

    /**
     * Main portfolio creation workflow orchestrator
     */
    async createPortfolio(
        payload: CreatePortfolioPayload,
    ): Promise<CreatePortfolioResult> {
        const {
            userId,
            executionId,
            name,
            exchanges,
            apiKey,
            secretKey,
            passphrase,
        } = payload;

        // Normalize exchange name to lowercase for CCXT compatibility
        const normalizedExchange = exchanges.toLowerCase();
        const exchangeEnum = exchanges as Exchanges;

        this.logger.log(
            `🚀 Creating portfolio for user ${userId}, execution ${executionId}, exchange ${normalizedExchange} (original: ${exchanges})`,
        );

        try {
            // Step 1: Validate exchange support
            await this.portfolioProgressService.startStep(
                executionId,
                PortfolioCreationStep.VALIDATION,
                exchangeEnum,
            );
            await this.validateExchange(normalizedExchange);
            await this.portfolioProgressService.completeStep(
                executionId,
                PortfolioCreationStep.VALIDATION,
            );

            // Step 2: Decrypt credentials and test connection (merged AUTHENTICATION + CONNECTION)
            await this.portfolioProgressService.startStep(
                executionId,
                PortfolioCreationStep.AUTHENTICATION,
                exchangeEnum,
            );
            const credentials = await this.decryptCredentials({
                apiKey,
                secretKey,
                passphrase,
            });
            await this.testExchangeConnection(normalizedExchange, credentials);
            await this.portfolioProgressService.completeStep(
                executionId,
                PortfolioCreationStep.AUTHENTICATION,
            );

            // Step 3: Fetch and process account balances (merged BALANCE_FETCH + DATA_PROCESSING)
            await this.portfolioProgressService.startStep(
                executionId,
                PortfolioCreationStep.BALANCE_RETRIEVAL,
                exchangeEnum,
            );
            const balances = await this.fetchAccountBalances(
                normalizedExchange,
                credentials,
            );
            const processedBalances = await this.processBalances(balances);
            await this.portfolioProgressService.completeStep(
                executionId,
                PortfolioCreationStep.BALANCE_RETRIEVAL,
            );

            // Step 4: Store in database
            await this.portfolioProgressService.startStep(
                executionId,
                PortfolioCreationStep.DATABASE_STORAGE,
                exchangeEnum,
            );
            const portfolioId = await this.createPortfolioRecord({
                userId,
                exchanges: exchangeEnum,
                name: name || `${exchanges} Portfolio`,
                apiKey,
                secretKey,
            });
            await this.storeAssetBalances(portfolioId, processedBalances);
            await this.portfolioProgressService.completeStep(
                executionId,
                PortfolioCreationStep.DATABASE_STORAGE,
            );

            // Step 5: Completion
            await this.portfolioProgressService.startStep(
                executionId,
                PortfolioCreationStep.COMPLETION,
                exchangeEnum,
            );
            await this.portfolioProgressService.completeStep(
                executionId,
                PortfolioCreationStep.COMPLETION,
            );

            // Mark as successful
            await this.portfolioProgressService.markSuccess(executionId);

            this.logger.log(`✅ Portfolio creation successful: ${portfolioId}`);

            return {
                portfolioId,
                balances,
                assets: balances, // For now, assets are the same as balances
                exchangeInfo:
                    this.portfolioExchangeService.getExchangeInfo(
                        normalizedExchange,
                    ),
            };
        } catch (error) {
            this.logger.error(
                `❌ Portfolio creation failed for execution ${executionId}:`,
                error,
            );

            // Determine which step failed and handle accordingly
            const execution =
                await this.portfolioProgressService.getExecution(executionId);
            const currentStep: PortfolioCreationStep =
                execution?.currentStep as PortfolioCreationStep;

            await this.portfolioProgressService.failStep(
                executionId,
                currentStep,
                error,
            );
            throw error;
        }
    }

    /**
     * Validate that the exchange is supported by CCXT
     */
    private async validateExchange(exchangeId: string): Promise<void> {
        this.logger.debug(`🔍 Validating exchange: ${exchangeId}`);

        if (!this.portfolioExchangeService.isExchangeSupported(exchangeId)) {
            throw new Error(
                `Exchange '${exchangeId}' is not supported. Supported exchanges: ${this.getSupportedExchangesList()}`,
            );
        }

        const exchangeInfo =
            this.portfolioExchangeService.getExchangeInfo(exchangeId);
        if (!exchangeInfo?.hasBalance) {
            throw new Error(
                `Exchange '${exchangeId}' does not support balance fetching`,
            );
        }

        this.logger.debug(
            `✅ Exchange ${exchangeId} is supported and has balance capability`,
        );
    }

    /**
     * Decrypt all exchange credentials
     */
    private async decryptCredentials(encryptedCredentials: {
        apiKey: string;
        secretKey: string;
        passphrase?: string;
        sandbox?: boolean;
    }) {
        this.logger.debug("🔓 Decrypting exchange credentials...");

        try {
            const credentials = {
                apiKey: await this.portfolioExchangeService.decryptApiKey(
                    encryptedCredentials.apiKey,
                ),
                secretKey: await this.portfolioExchangeService.decryptSecretKey(
                    encryptedCredentials.secretKey,
                ),
                passphrase: encryptedCredentials.passphrase
                    ? await this.portfolioExchangeService.decryptPassphrase(
                          encryptedCredentials.passphrase,
                      )
                    : undefined,
                sandbox: encryptedCredentials.sandbox || false,
            };

            this.logger.debug("✅ Credentials decrypted successfully");
            return credentials;
        } catch (error) {
            this.logger.error("❌ Failed to decrypt credentials:", error);
            throw new Error("Invalid or corrupted exchange credentials");
        }
    }

    /**
     * Test connection to the exchange with decrypted credentials
     */
    private async testExchangeConnection(
        exchangeId: string,
        credentials: any,
    ): Promise<void> {
        this.logger.debug(`🔌 Testing connection to ${exchangeId}...`);

        const isConnected =
            await this.portfolioExchangeService.testExchangeConnection(
                exchangeId,
                credentials,
            );

        if (!isConnected) {
            throw new Error(
                `Failed to connect to ${exchangeId}. Please verify your API credentials and permissions.`,
            );
        }

        this.logger.debug(`✅ Successfully connected to ${exchangeId}`);
    }

    /**
     * Fetch account balances from the exchange
     */
    private async fetchAccountBalances(
        exchangeId: string,
        credentials: any,
    ): Promise<PortfolioBalance[]> {
        this.logger.debug(`💰 Fetching account balances from ${exchangeId}...`);

        try {
            const balances = await this.portfolioExchangeService.fetchBalances(
                exchangeId,
                credentials,
            );

            // Transform to PortfolioBalance format
            const portfolioBalances: PortfolioBalance[] = balances.map(
                (balance) => ({
                    symbol: balance.symbol,
                    free: balance.free,
                    used: balance.used,
                    total: balance.total,
                    usdValue: undefined, // USD value calculation could be added here
                }),
            );

            this.logger.debug(
                `✅ Fetched ${portfolioBalances.length} balances from ${exchangeId}`,
            );
            return portfolioBalances;
        } catch (error) {
            this.logger.error(
                `❌ Failed to fetch balances from ${exchangeId}:`,
                error,
            );
            throw new Error(
                `Unable to fetch account balances: ${error.message}`,
            );
        }
    }

    /**
     * Process balances and prepare for database storage
     */
    private async processBalances(
        balances: PortfolioBalance[],
    ): Promise<
        Array<{ assetInfoId: string; balance: number; locked: number }>
    > {
        this.logger.debug(`📊 Processing ${balances.length} balances...`);

        const processedBalances = [];

        for (const balance of balances) {
            try {
                // Find or create asset info for this symbol
                const assetInfoId =
                    await this.portfolioProgressService.findOrCreateAssetInfo(
                        balance.symbol,
                        {
                            name: balance.symbol,
                            category: "Cryptocurrency",
                            desc: `${balance.symbol} cryptocurrency`,
                        },
                    );

                processedBalances.push({
                    assetInfoId,
                    balance: balance.free,
                    locked: balance.used,
                });
            } catch (error) {
                this.logger.warn(
                    `⚠️ Failed to process balance for ${balance.symbol}, skipping:`,
                    error,
                );
                // Continue processing other balances even if one fails
            }
        }

        this.logger.debug(
            `✅ Processed ${processedBalances.length} balances successfully`,
        );
        return processedBalances;
    }

    /**
     * Create portfolio record in database
     */
    private async createPortfolioRecord(
        portfolioData: Pick<
            PortfolioData,
            "userId" | "exchanges" | "name" | "apiKey" | "secretKey"
        >,
    ): Promise<string> {
        this.logger.debug(`💾 Creating portfolio record...`);

        try {
            const portfolioId =
                await this.portfolioProgressService.createPortfolio(
                    portfolioData,
                );
            this.logger.debug(
                `✅ Portfolio record created with ID: ${portfolioId}`,
            );
            return portfolioId;
        } catch (error) {
            this.logger.error("❌ Failed to create portfolio record:", error);
            throw new Error(
                `Database error during portfolio creation: ${error.message}`,
            );
        }
    }

    /**
     * Store asset balances in database
     */
    private async storeAssetBalances(
        portfolioId: string,
        balances: Array<{
            assetInfoId: string;
            balance: number;
            locked: number;
        }>,
    ): Promise<void> {
        this.logger.debug(`💰 Storing ${balances.length} asset balances...`);

        try {
            await this.portfolioProgressService.upsertAssetBalances(
                portfolioId,
                balances,
            );
            this.logger.debug(`✅ Asset balances stored successfully`);
        } catch (error) {
            this.logger.error("❌ Failed to store asset balances:", error);
            throw new Error(
                `Database error during balance storage: ${error.message}`,
            );
        }
    }

    /**
     * Get list of supported exchanges for error messages
     */
    private getSupportedExchangesList(): string {
        try {
            const exchanges =
                this.portfolioExchangeService.getAllSupportedExchanges();
            const supportedExchanges = exchanges
                .filter((exchange) => exchange.supported && exchange.hasBalance)
                .map((exchange) => exchange.id)
                .slice(0, 10); // Show first 10 to avoid overwhelming the user

            return (
                supportedExchanges.join(", ") +
                (exchanges.length > 10 ? ", ..." : "")
            );
        } catch (error) {
            return "binance, mexc, okx, and many others";
        }
    }

    /**
     * Retry portfolio creation for a failed execution using stored execution context
     */
    async retryPortfolioCreation(
        payload: RetryPortfolioPayload,
    ): Promise<CreatePortfolioResult> {
        this.logger.log(
            `🔄 Retrying portfolio creation for execution ${payload.executionId}`,
        );

        try {
            // Build complete payload from execution context and overrides
            const completePayload = await this.buildCompletePayloadFromExecution(
                payload.executionId,
                payload,
            );

            // Execute the main portfolio creation workflow
            return await this.createPortfolio(completePayload);
        } catch (error) {
            this.logger.error(
                `❌ Portfolio retry failed for execution ${payload.executionId}:`,
                error,
            );
            throw error;
        }
    }

    /**
     * Update credentials for a failed execution and retry using stored execution context
     */
    async updatePortfolioCredentials(
        payload: UpdateCredentialsPayload,
    ): Promise<CreatePortfolioResult> {
        this.logger.log(
            `🔑 Updating credentials and retrying for execution ${payload.executionId}`,
        );

        try {
            // Build complete payload from execution context and new credentials
            const completePayload = await this.buildCompletePayloadFromExecution(
                payload.executionId,
                payload,
            );

            // Execute the main portfolio creation workflow with updated credentials
            return await this.createPortfolio(completePayload);
        } catch (error) {
            this.logger.error(
                `❌ Credential update and retry failed for execution ${payload.executionId}:`,
                error,
            );
            throw error;
        }
    }

    /**
     * Build complete payload by merging execution context with provided overrides
     */
    private async buildCompletePayloadFromExecution(
        executionId: number,
        overrides: Partial<CreatePortfolioPayload>,
    ): Promise<CreatePortfolioPayload> {
        this.logger.debug(
            `🔧 Building complete payload for execution ${executionId}`,
        );

        // Get execution record with context
        const execution = await this.portfolioProgressService.getExecution(executionId);
        if (!execution) {
            throw new Error(`Execution ${executionId} not found`);
        }

        // Parse stored execution context
        let storedContext: Partial<CreatePortfolioPayload> = {};
        if (execution.executionContext) {
            try {
                storedContext = JSON.parse(execution.executionContext as string);
                this.logger.debug(
                    `📋 Retrieved stored context for execution ${executionId}:`,
                    { ...storedContext, apiKey: '[HIDDEN]', secretKey: '[HIDDEN]' },
                );
            } catch (error) {
                this.logger.warn(
                    `⚠️ Failed to parse execution context for ${executionId}, continuing with overrides only`,
                );
            }
        }

        // Merge stored context with overrides (overrides take precedence)
        const mergedPayload: CreatePortfolioPayload = {
            userId: execution.userId,
            executionId: executionId,
            name: overrides.name || storedContext.name || `${overrides.exchanges || storedContext.exchanges} Portfolio`,
            exchanges: overrides.exchanges || storedContext.exchanges,
            apiKey: overrides.apiKey || storedContext.apiKey,
            secretKey: overrides.secretKey || storedContext.secretKey,
            passphrase: overrides.passphrase || storedContext.passphrase,
        };

        // Validate that required fields are present
        if (!mergedPayload.exchanges) {
            throw new Error(
                `Missing exchange information for execution ${executionId}. Cannot proceed with retry.`,
            );
        }
        if (!mergedPayload.apiKey) {
            throw new Error(
                `Missing API key for execution ${executionId}. Cannot proceed with retry.`,
            );
        }
        if (!mergedPayload.secretKey) {
            throw new Error(
                `Missing secret key for execution ${executionId}. Cannot proceed with retry.`,
            );
        }

        this.logger.debug(
            `✅ Complete payload built for execution ${executionId}:`,
            { ...mergedPayload, apiKey: '[HIDDEN]', secretKey: '[HIDDEN]' },
        );

        return mergedPayload;
    }
}
