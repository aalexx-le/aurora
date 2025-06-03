import { registerEnumType } from '@nestjs/graphql';

export enum PortfolioCreationStep {
    VALIDATION = "VALIDATION",
    AUTHENTICATION = "AUTHENTICATION",
    CONNECTION = "CONNECTION",
    ACCOUNT_INFO = "ACCOUNT_INFO",
    BALANCE_FETCH = "BALANCE_FETCH",
    DATA_PROCESSING = "DATA_PROCESSING",
    DATABASE_STORAGE = "DATABASE_STORAGE",
    FINALIZATION = "FINALIZATION"
}


registerEnumType(PortfolioCreationStep, { name: 'PortfolioCreationStep', description: undefined })
