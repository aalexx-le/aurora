import { registerEnumType } from '@nestjs/graphql';

export enum DiscountType {
    PERCENTAGE = "PERCENTAGE",
    FIXED_AMOUNT = "FIXED_AMOUNT",
    FREE_TRIAL = "FREE_TRIAL"
}


registerEnumType(DiscountType, { name: 'DiscountType', description: undefined })
