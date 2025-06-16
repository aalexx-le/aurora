import { EnhancedTrade, PnLCalculationResult, TaxLot } from "../shared/interfaces/portfolio-types.interface";
export declare class PnLCalculationService {
    private readonly logger;
    calculatePortfolioPnL(trades: EnhancedTrade[], currentPrices: Map<string, number>): Promise<PnLCalculationResult>;
    private calculateAssetPnL;
    private processSale;
    private groupTradesByAsset;
    private queueToArray;
    calculateTaxLots(assetSymbol: string, trades: EnhancedTrade[]): Promise<TaxLot[]>;
}
