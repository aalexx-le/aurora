import { registerEnumType } from '@nestjs/graphql';

export enum HistoricalAssetProfitScalarFieldEnum {
    time = "time",
    estimatedProfit = "estimatedProfit",
    totalCostInQuoteQty = "totalCostInQuoteQty",
    remainingQty = "remainingQty",
    assetInfoId = "assetInfoId",
    cryptoPortfolioId = "cryptoPortfolioId",
    realizedPnl = "realizedPnl",
    unrealizedPnl = "unrealizedPnl",
    totalPnl = "totalPnl",
    averageCostBasis = "averageCostBasis",
    currentPrice = "currentPrice",
    percentageGain = "percentageGain",
    holdingPeriodDays = "holdingPeriodDays"
}


registerEnumType(HistoricalAssetProfitScalarFieldEnum, { name: 'HistoricalAssetProfitScalarFieldEnum', description: undefined })
