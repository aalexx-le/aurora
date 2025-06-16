import { Injectable, Logger } from "@nestjs/common";
import {
    AssetPnLData,
    EnhancedTrade,
    PortfolioAnalyticsResult,
} from "../shared/interfaces/portfolio-types.interface";

@Injectable()
export class PortfolioAnalyticsService {
    private readonly logger = new Logger(PortfolioAnalyticsService.name);

    /**
     * Calculate comprehensive portfolio analytics
     */
    async calculatePortfolioAnalytics(
        assetPnLData: AssetPnLData[],
    ): Promise<PortfolioAnalyticsResult> {
        this.logger.log(
            `📈 Calculating portfolio analytics for ${assetPnLData.length} assets`,
        );

        try {
            const totalValue = this.calculateTotalValue(assetPnLData);
            const totalReturn = this.calculateTotalReturn(assetPnLData);
            const totalPnL = this.calculateTotalPnL(assetPnLData);
            const assetCount = assetPnLData.length;
            const diversificationScore = this.calculateDiversificationScore(
                assetPnLData,
                totalValue,
            );
            const riskScore = this.calculateRiskScore(assetPnLData, totalValue);

            const result: PortfolioAnalyticsResult = {
                totalValue,
                totalReturn,
                totalPnL,
                assetCount,
                diversificationScore,
                riskScore,
            };

            this.logger.log(
                `✅ Portfolio analytics completed. Total Value: ${totalValue}, Risk Score: ${riskScore}`,
            );
            return result;
        } catch (error) {
            this.logger.error(
                "❌ Failed to calculate portfolio analytics:",
                error,
            );
            throw error;
        }
    }

    /**
     * Calculate total portfolio value
     */
    private calculateTotalValue(assetPnLData: AssetPnLData[]): number {
        return assetPnLData.reduce((total, asset) => {
            return total + asset.totalQuantity * asset.currentPrice;
        }, 0);
    }

    /**
     * Calculate total portfolio P&L
     */
    private calculateTotalPnL(assetPnLData: AssetPnLData[]): number {
        return assetPnLData.reduce((total, asset) => total + asset.totalPnL, 0);
    }

    /**
     * Calculate portfolio diversification score (0-100)
     * Higher score = more diversified
     */
    private calculateDiversificationScore(
        assetPnLData: AssetPnLData[],
        totalValue: number,
    ): number {
        if (assetPnLData.length === 0 || totalValue === 0) return 0;

        // Calculate Herfindahl-Hirschman Index (HHI) for concentration
        let hhi = 0;
        for (const asset of assetPnLData) {
            const assetValue = asset.totalQuantity * asset.currentPrice;
            const weight = assetValue / totalValue;
            hhi += weight * weight;
        }

        // Convert HHI to diversification score (inverse relationship)
        // HHI ranges from 1/n (perfectly diversified) to 1 (concentrated)
        // Diversification score: 100 = perfectly diversified, 0 = single asset
        const maxHHI = 1; // Single asset
        const minHHI = 1 / assetPnLData.length; // Perfectly diversified
        const normalizedHHI = (hhi - minHHI) / (maxHHI - minHHI);
        const diversificationScore = Math.max(
            0,
            Math.min(100, (1 - normalizedHHI) * 100),
        );

        this.logger.debug(
            `📊 Diversification: HHI=${hhi.toFixed(4)}, Score=${diversificationScore.toFixed(2)}`,
        );
        return Math.round(diversificationScore * 100) / 100;
    }

    /**
     * Calculate portfolio risk score (0-100)
     * Higher score = higher risk
     */
    private calculateRiskScore(
        assetPnLData: AssetPnLData[],
        totalValue: number,
    ): number {
        if (assetPnLData.length === 0 || totalValue === 0) return 0;

        // Calculate portfolio volatility based on asset concentration and P&L variance
        let weightedVolatility = 0;

        for (const asset of assetPnLData) {
            const assetValue = asset.totalQuantity * asset.currentPrice;
            const weight = assetValue / totalValue;

            // Use percentage gain as volatility proxy
            const assetVolatility = Math.abs(asset.percentageGain);
            weightedVolatility += weight * assetVolatility;
        }

        // Combine volatility and concentration risk
        const concentrationRisk = this.calculateConcentrationRisk(
            assetPnLData,
            totalValue,
        );
        const volatilityRisk = Math.min(100, weightedVolatility); // Cap at 100%

        // Weighted combination of risk factors
        const riskScore = volatilityRisk * 0.7 + concentrationRisk * 0.3;

        this.logger.debug(
            `⚠️ Risk: Volatility=${volatilityRisk.toFixed(2)}, Concentration=${concentrationRisk.toFixed(2)}, Total=${riskScore.toFixed(2)}`,
        );
        return Math.round(riskScore * 100) / 100;
    }

    /**
     * Calculate concentration risk (0-100)
     */
    private calculateConcentrationRisk(
        assetPnLData: AssetPnLData[],
        totalValue: number,
    ): number {
        if (assetPnLData.length === 0 || totalValue === 0) return 100;

        // Find the largest position as percentage of portfolio
        let maxWeight = 0;
        for (const asset of assetPnLData) {
            const assetValue = asset.totalQuantity * asset.currentPrice;
            const weight = assetValue / totalValue;
            maxWeight = Math.max(maxWeight, weight);
        }

        // Convert to risk score (higher concentration = higher risk)
        return Math.min(100, maxWeight * 100);
    }

    /**
     * Calculate total return percentage
     */
    private calculateTotalReturn(assetPnLData: AssetPnLData[]): number {
        let totalInvested = 0;
        let totalCurrentValue = 0;

        for (const asset of assetPnLData) {
            const invested = asset.totalQuantity * asset.averageCostBasis;
            const currentValue = asset.totalQuantity * asset.currentPrice;

            totalInvested += invested;
            totalCurrentValue += currentValue;
        }

        if (totalInvested === 0) return 0;
        return ((totalCurrentValue - totalInvested) / totalInvested) * 100;
    }
}
