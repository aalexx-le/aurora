export interface TaxLot {
    quantity: number;
    costBasis: number;
    purchaseDate: Date;
    assetSymbol: string;
}
export interface SaleResult {
    soldQuantity: number;
    totalCostBasis: number;
    realizedGain: number;
    soldLots: TaxLot[];
    remainingLots?: TaxLot[];
}
export interface EnhancedTrade {
    id?: string;
    assetInfoId: string;
    symbol: string;
    qty: number;
    price: number;
    time: Date;
    isBuyer: boolean;
    quoteQty: number;
    commission: number;
    commissionAsset: string;
    tradeId?: string;
    orderId?: string;
    cryptoPortfolioId?: string;
    side?: string;
    fees?: number;
    feeAsset?: string;
}
export interface AssetPnLData {
    assetSymbol: string;
    assetInfoId: string;
    totalQuantity: number;
    averageCostBasis: number;
    currentPrice: number;
    realizedPnL: number;
    unrealizedPnL: number;
    totalPnL: number;
    percentageGain: number;
    holdingPeriodDays: number;
}
export interface PnLCalculationResult {
    assetPnL: AssetPnLData[];
    portfolioTotalPnL: number;
    totalRealizedPnL: number;
    totalUnrealizedPnL: number;
}
export interface PortfolioAnalyticsResult {
    totalValue: number;
    totalReturn: number;
    totalPnL: number;
    assetCount: number;
    diversificationScore: number;
    riskScore: number;
}
export interface SymbolDiscoveryResult {
    discoveredSymbols: string[];
    currentBalanceSymbols: string[];
    historicalSymbols: string[];
    totalSymbols: number;
    timestamp?: Date;
}
export interface TradeHistoryResult {
    trades: EnhancedTrade[];
    totalTrades: number;
    processedSymbols: string[];
    failedSymbols: string[];
    timestamp?: Date;
}
export interface ExchangeCredentials {
    apiKey: string;
    secretKey: string;
    passphrase?: string;
    sandbox?: boolean;
}
export interface AssetInfo {
    id: string;
    symbol: string;
    name: string;
    category: string;
    desc?: string;
    logo?: string;
}
export interface PortfolioAsset {
    assetInfo: AssetInfo;
    balance: number;
    locked: number;
    usdValue?: number;
    percentage?: number;
}
export interface OHLCVData {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}
export interface PriceHistoryData {
    symbol: string;
    data: OHLCVData[];
    timeframe: string;
}
export interface ExchangeInfo {
    id: string;
    name: string;
    countries?: string[];
    urls?: {
        logo?: string;
        api?: string;
        www?: string;
        doc?: string[];
    };
    version?: string;
    has?: {
        [key: string]: boolean;
    };
    [key: string]: any;
}
