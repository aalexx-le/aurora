import { registerEnumType } from '@nestjs/graphql';

export enum Historical_asset_profit_5mScalarFieldEnum {
    time = "time",
    assetInfoId = "assetInfoId",
    cryptoPortfolioId = "cryptoPortfolioId",
    estimatedProfit = "estimatedProfit",
    totalCostInQuoteQty = "totalCostInQuoteQty",
    remainingQty = "remainingQty"
}


registerEnumType(Historical_asset_profit_5mScalarFieldEnum, { name: 'Historical_asset_profit_5mScalarFieldEnum', description: undefined })
