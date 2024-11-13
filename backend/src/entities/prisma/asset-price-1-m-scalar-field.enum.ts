import { registerEnumType } from '@nestjs/graphql';

export enum Asset_price_1MScalarFieldEnum {
    open_time = "open_time",
    assetInfoId = "assetInfoId",
    openPrice = "openPrice",
    closePrice = "closePrice",
    highPrice = "highPrice",
    lowPrice = "lowPrice",
    volume = "volume"
}


registerEnumType(Asset_price_1MScalarFieldEnum, { name: 'Asset_price_1MScalarFieldEnum', description: undefined })
