import { registerEnumType } from '@nestjs/graphql';

export enum HistoricalCryptoBalanceScalarFieldEnum {
    time = "time",
    estimatedBalance = "estimatedBalance",
    changePercent = "changePercent",
    changeBalance = "changeBalance",
    cryptoPortfolioId = "cryptoPortfolioId"
}


registerEnumType(HistoricalCryptoBalanceScalarFieldEnum, { name: 'HistoricalCryptoBalanceScalarFieldEnum', description: undefined })
