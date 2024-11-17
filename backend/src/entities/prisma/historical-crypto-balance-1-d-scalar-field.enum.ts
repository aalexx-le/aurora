import { registerEnumType } from "@nestjs/graphql";

export enum Historical_crypto_balance_1dScalarFieldEnum {
    time = "time",
    estimatedBalance = "estimatedBalance",
    changeBalance = "changeBalance",
    changePercent = "changePercent",
    cryptoPortfolioId = "cryptoPortfolioId"
}


registerEnumType(Historical_crypto_balance_1dScalarFieldEnum, { name: 'Historical_crypto_balance_1dScalarFieldEnum', description: undefined })
