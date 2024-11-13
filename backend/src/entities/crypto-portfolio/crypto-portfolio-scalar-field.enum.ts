import { registerEnumType } from '@nestjs/graphql';

export enum CryptoPortfolioScalarFieldEnum {
    id = "id",
    userId = "userId",
    exchanges = "exchanges",
    tradingType = "tradingType",
    apiKey = "apiKey",
    secretKey = "secretKey",
    updateTime = "updateTime"
}


registerEnumType(CryptoPortfolioScalarFieldEnum, { name: 'CryptoPortfolioScalarFieldEnum', description: undefined })
