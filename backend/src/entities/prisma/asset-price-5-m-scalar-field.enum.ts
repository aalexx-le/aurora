import { registerEnumType } from "@nestjs/graphql";

export enum Asset_price_5mScalarFieldEnum {
    open_time = "open_time",
    assetInfoId = "assetInfoId",
    openPrice = "openPrice",
    closePrice = "closePrice",
    highPrice = "highPrice",
    lowPrice = "lowPrice",
    volume = "volume"
}


registerEnumType(Asset_price_5mScalarFieldEnum, { name: 'Asset_price_5mScalarFieldEnum', description: undefined })
