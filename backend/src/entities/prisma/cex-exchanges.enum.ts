import { registerEnumType } from '@nestjs/graphql';

export enum CEXExchanges {
    BINANCE = "BINANCE",
    MEXC = "MEXC"
}


registerEnumType(CEXExchanges, { name: 'CEXExchanges', description: undefined })
