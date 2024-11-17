import { registerEnumType } from '@nestjs/graphql';

export enum CryptoPortfolioScalarFieldEnum {
    userId = "userId",
    exchanges = "exchanges",
    tradingType = "tradingType",
    apiKey = "apiKey",
    secretKey = "secretKey",
    updateTime = "updateTime",
    id = "id",
    investmentCategoryName = "investmentCategoryName"
}


registerEnumType(CryptoPortfolioScalarFieldEnum, { name: 'CryptoPortfolioScalarFieldEnum', description: undefined })
