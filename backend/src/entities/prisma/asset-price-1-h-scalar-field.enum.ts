import { registerEnumType } from "@nestjs/graphql";

export enum Asset_price_1hScalarFieldEnum {
    open_time = "open_time",
    assetInfoId = "assetInfoId",
    openPrice = "openPrice",
    closePrice = "closePrice",
    highPrice = "highPrice",
    lowPrice = "lowPrice",
    volume = "volume"
}


registerEnumType(Asset_price_1hScalarFieldEnum, { name: 'Asset_price_1hScalarFieldEnum', description: undefined })
