import { registerEnumType } from '@nestjs/graphql';

export enum PriceStatus {
    active = "active",
    archived = "archived"
}


registerEnumType(PriceStatus, { name: 'PriceStatus', description: undefined })
