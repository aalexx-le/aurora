"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PortfolioAnalyticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioAnalyticsService = void 0;
const common_1 = require("@nestjs/common");
let PortfolioAnalyticsService = PortfolioAnalyticsService_1 = class PortfolioAnalyticsService {
    constructor() {
        this.logger = new common_1.Logger(PortfolioAnalyticsService_1.name);
    }
    async calculatePortfolioAnalytics(assetPnLData) {
        this.logger.log(`📈 Calculating portfolio analytics for ${assetPnLData.length} assets`);
        try {
            const totalValue = this.calculateTotalValue(assetPnLData);
            const totalReturn = this.calculateTotalReturn(assetPnLData);
            const totalPnL = this.calculateTotalPnL(assetPnLData);
            const assetCount = assetPnLData.length;
            const diversificationScore = this.calculateDiversificationScore(assetPnLData, totalValue);
            const riskScore = this.calculateRiskScore(assetPnLData, totalValue);
            const result = {
                totalValue,
                totalReturn,
                totalPnL,
                assetCount,
                diversificationScore,
                riskScore,
            };
            this.logger.log(`✅ Portfolio analytics completed. Total Value: ${totalValue}, Risk Score: ${riskScore}`);
            return result;
        }
        catch (error) {
            this.logger.error("❌ Failed to calculate portfolio analytics:", error);
            throw error;
        }
    }
    calculateTotalValue(assetPnLData) {
        return assetPnLData.reduce((total, asset) => {
            return total + asset.totalQuantity * asset.currentPrice;
        }, 0);
    }
    calculateTotalPnL(assetPnLData) {
        return assetPnLData.reduce((total, asset) => total + asset.totalPnL, 0);
    }
    calculateDiversificationScore(assetPnLData, totalValue) {
        if (assetPnLData.length === 0 || totalValue === 0)
            return 0;
        let hhi = 0;
        for (const asset of assetPnLData) {
            const assetValue = asset.totalQuantity * asset.currentPrice;
            const weight = assetValue / totalValue;
            hhi += weight * weight;
        }
        const maxHHI = 1;
        const minHHI = 1 / assetPnLData.length;
        const normalizedHHI = (hhi - minHHI) / (maxHHI - minHHI);
        const diversificationScore = Math.max(0, Math.min(100, (1 - normalizedHHI) * 100));
        this.logger.debug(`📊 Diversification: HHI=${hhi.toFixed(4)}, Score=${diversificationScore.toFixed(2)}`);
        return Math.round(diversificationScore * 100) / 100;
    }
    calculateRiskScore(assetPnLData, totalValue) {
        if (assetPnLData.length === 0 || totalValue === 0)
            return 0;
        let weightedVolatility = 0;
        for (const asset of assetPnLData) {
            const assetValue = asset.totalQuantity * asset.currentPrice;
            const weight = assetValue / totalValue;
            const assetVolatility = Math.abs(asset.percentageGain);
            weightedVolatility += weight * assetVolatility;
        }
        const concentrationRisk = this.calculateConcentrationRisk(assetPnLData, totalValue);
        const volatilityRisk = Math.min(100, weightedVolatility);
        const riskScore = volatilityRisk * 0.7 + concentrationRisk * 0.3;
        this.logger.debug(`⚠️ Risk: Volatility=${volatilityRisk.toFixed(2)}, Concentration=${concentrationRisk.toFixed(2)}, Total=${riskScore.toFixed(2)}`);
        return Math.round(riskScore * 100) / 100;
    }
    calculateConcentrationRisk(assetPnLData, totalValue) {
        if (assetPnLData.length === 0 || totalValue === 0)
            return 100;
        let maxWeight = 0;
        for (const asset of assetPnLData) {
            const assetValue = asset.totalQuantity * asset.currentPrice;
            const weight = assetValue / totalValue;
            maxWeight = Math.max(maxWeight, weight);
        }
        return Math.min(100, maxWeight * 100);
    }
    calculateTotalReturn(assetPnLData) {
        let totalInvested = 0;
        let totalCurrentValue = 0;
        for (const asset of assetPnLData) {
            const invested = asset.totalQuantity * asset.averageCostBasis;
            const currentValue = asset.totalQuantity * asset.currentPrice;
            totalInvested += invested;
            totalCurrentValue += currentValue;
        }
        if (totalInvested === 0)
            return 0;
        return ((totalCurrentValue - totalInvested) / totalInvested) * 100;
    }
};
exports.PortfolioAnalyticsService = PortfolioAnalyticsService;
exports.PortfolioAnalyticsService = PortfolioAnalyticsService = PortfolioAnalyticsService_1 = __decorate([
    (0, common_1.Injectable)()
], PortfolioAnalyticsService);
//# sourceMappingURL=portfolio-analytics.service.js.map