import { registerEnumType } from '@nestjs/graphql';

export enum Historical_asset_profit_1hScalarFieldEnum {
    time = "time",
    assetInfoId = "assetInfoId",
    cryptoPortfolioId = "cryptoPortfolioId",
    estimatedProfit = "estimatedProfit",
    totalCostInQuoteQty = "totalCostInQuoteQty",
    remainingQty = "remainingQty"
}


registerEnumType(Historical_asset_profit_1hScalarFieldEnum, { name: 'Historical_asset_profit_1hScalarFieldEnum', description: undefined })
