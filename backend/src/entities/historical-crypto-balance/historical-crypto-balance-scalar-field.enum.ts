import { registerEnumType } from '@nestjs/graphql';

export enum HistoricalCryptoBalanceScalarFieldEnum {
    time = "time",
    estimatedBalance = "estimatedBalance",
    changePercent = "changePercent",
    changeBalance = "changeBalance",
    cryptoPortfolioId = "cryptoPortfolioId",
    totalValue = "totalValue",
    totalPnl = "totalPnl",
    totalRealizedPnl = "totalRealizedPnl",
    totalUnrealizedPnl = "totalUnrealizedPnl",
    assetCount = "assetCount",
    diversificationScore = "diversificationScore",
    riskScore = "riskScore"
}


registerEnumType(HistoricalCryptoBalanceScalarFieldEnum, { name: 'HistoricalCryptoBalanceScalarFieldEnum', description: undefined })
