import { AssetPnLData, PortfolioAnalyticsResult } from "../shared/interfaces/portfolio-types.interface";
export declare class PortfolioAnalyticsService {
    private readonly logger;
    calculatePortfolioAnalytics(assetPnLData: AssetPnLData[]): Promise<PortfolioAnalyticsResult>;
    private calculateTotalValue;
    private calculateTotalPnL;
    private calculateDiversificationScore;
    private calculateRiskScore;
    private calculateConcentrationRisk;
    private calculateTotalReturn;
}
