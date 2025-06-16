import { registerEnumType } from '@nestjs/graphql';

export enum PortfolioCreationStep {
    VALIDATION = "VALIDATION",
    AUTHENTICATION = "AUTHENTICATION",
    BALANCE_RETRIEVAL = "BALANCE_RETRIEVAL",
    SYMBOL_DISCOVERY = "SYMBOL_DISCOVERY",
    TRADE_HISTORY_FETCH = "TRADE_HISTORY_FETCH",
    PRICE_HISTORY_FETCH = "PRICE_HISTORY_FETCH",
    PNL_CALCULATION = "PNL_CALCULATION",
    ANALYTICS_CALCULATION = "ANALYTICS_CALCULATION",
    COMPLETION = "COMPLETION"
}


registerEnumType(PortfolioCreationStep, { name: 'PortfolioCreationStep', description: undefined })
