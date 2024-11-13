import { registerEnumType } from '@nestjs/graphql';

export enum Historical_crypto_balance_1hScalarFieldEnum {
    time = "time",
    estimatedBalance = "estimatedBalance",
    changeBalance = "changeBalance",
    changePercent = "changePercent",
    cryptoPortfolioId = "cryptoPortfolioId"
}


registerEnumType(Historical_crypto_balance_1hScalarFieldEnum, { name: 'Historical_crypto_balance_1hScalarFieldEnum', description: undefined })
