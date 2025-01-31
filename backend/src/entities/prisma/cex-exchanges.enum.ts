import { registerEnumType } from '@nestjs/graphql';

export enum CEXExchanges {
    BINANCE = "BINANCE",
    MEXC = "MEXC",
    OKX = "OKX",
    ALL = "ALL"
}


registerEnumType(CEXExchanges, { name: 'CEXExchanges', description: undefined })
