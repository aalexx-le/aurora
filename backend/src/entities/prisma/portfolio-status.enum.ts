import { registerEnumType } from '@nestjs/graphql';

export enum PortfolioStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}


registerEnumType(PortfolioStatus, { name: 'PortfolioStatus', description: undefined })
