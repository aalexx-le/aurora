import { registerEnumType } from '@nestjs/graphql';

export enum HistoricalAssetProfitScalarFieldEnum {
    time = "time",
    estimatedProfit = "estimatedProfit",
    totalCostInQuoteQty = "totalCostInQuoteQty",
    remainingQty = "remainingQty",
    assetInfoId = "assetInfoId",
    cryptoPortfolioId = "cryptoPortfolioId"
}


registerEnumType(HistoricalAssetProfitScalarFieldEnum, { name: 'HistoricalAssetProfitScalarFieldEnum', description: undefined })
