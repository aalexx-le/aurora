import { registerEnumType } from '@nestjs/graphql';

export enum TradeScalarFieldEnum {
    id = "id",
    cryptoPortfolioId = "cryptoPortfolioId",
    assetInfoId = "assetInfoId",
    price = "price",
    qty = "qty",
    quoteQty = "quoteQty",
    commission = "commission",
    commissionAsset = "commissionAsset",
    time = "time",
    isBuyer = "isBuyer",
    orderId = "orderId",
    symbol = "symbol",
    side = "side",
    realizedPnl = "realizedPnl",
    fees = "fees",
    feeAsset = "feeAsset"
}


registerEnumType(TradeScalarFieldEnum, { name: 'TradeScalarFieldEnum', description: undefined })
