import { registerEnumType } from "@nestjs/graphql";

export enum TradingType {
    FUTURES = "FUTURES",
    SPOT = "SPOT"
}


registerEnumType(TradingType, { name: 'TradingType', description: undefined })
