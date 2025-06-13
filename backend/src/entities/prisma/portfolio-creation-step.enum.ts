import { registerEnumType } from '@nestjs/graphql';

export enum PortfolioCreationStep {
    VALIDATION = "VALIDATION",
    AUTHENTICATION = "AUTHENTICATION",
    BALANCE_RETRIEVAL = "BALANCE_RETRIEVAL",
    DATABASE_STORAGE = "DATABASE_STORAGE",
    COMPLETION = "COMPLETION"
}


registerEnumType(PortfolioCreationStep, { name: 'PortfolioCreationStep', description: undefined })
