import { registerEnumType } from '@nestjs/graphql';

export enum TradeScalarFieldEnum {
    cryptoPortfolioId = "cryptoPortfolioId",
    assetInfoId = "assetInfoId",
    price = "price",
    qty = "qty",
    quoteQty = "quoteQty",
    commission = "commission",
    commissionAsset = "commissionAsset",
    time = "time",
    isBuyer = "isBuyer"
}


registerEnumType(TradeScalarFieldEnum, { name: 'TradeScalarFieldEnum', description: undefined })
