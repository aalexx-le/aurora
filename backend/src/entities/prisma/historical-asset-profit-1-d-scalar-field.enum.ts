import { registerEnumType } from '@nestjs/graphql';

export enum Historical_asset_profit_1dScalarFieldEnum {
    time = "time",
    assetInfoId = "assetInfoId",
    cryptoPortfolioId = "cryptoPortfolioId",
    estimatedProfit = "estimatedProfit",
    totalCostInQuoteQty = "totalCostInQuoteQty",
    remainingQty = "remainingQty"
}


registerEnumType(Historical_asset_profit_1dScalarFieldEnum, { name: 'Historical_asset_profit_1dScalarFieldEnum', description: undefined })
