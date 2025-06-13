import { registerEnumType } from '@nestjs/graphql';

export enum DiscountTargetType {
    PRICE_SPECIFIC = "PRICE_SPECIFIC",
    FIRST_TIME_USER = "FIRST_TIME_USER"
}


registerEnumType(DiscountTargetType, { name: 'DiscountTargetType', description: undefined })
