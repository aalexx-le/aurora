import { registerEnumType } from '@nestjs/graphql';

export enum CryptoPortfolioScalarFieldEnum {
    userId = "userId",
    name = "name",
    status = "status",
    exchanges = "exchanges",
    tradingType = "tradingType",
    apiKey = "apiKey",
    secretKey = "secretKey",
    updateTime = "updateTime",
    id = "id",
    investmentCategoryName = "investmentCategoryName",
    parentPortfolioId = "parentPortfolioId"
}


registerEnumType(CryptoPortfolioScalarFieldEnum, { name: 'CryptoPortfolioScalarFieldEnum', description: undefined })
