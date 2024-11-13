import { registerEnumType } from '@nestjs/graphql';

export enum AssetPriceScalarFieldEnum {
    assetInfoId = "assetInfoId",
    interval = "interval",
    open_time = "open_time",
    close_time = "close_time",
    openPrice = "openPrice",
    closePrice = "closePrice",
    highPrice = "highPrice",
    lowPrice = "lowPrice",
    volume = "volume"
}


registerEnumType(AssetPriceScalarFieldEnum, { name: 'AssetPriceScalarFieldEnum', description: undefined })
