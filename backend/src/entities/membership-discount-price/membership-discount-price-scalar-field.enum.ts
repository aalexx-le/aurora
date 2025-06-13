import { registerEnumType } from '@nestjs/graphql';

export enum MembershipDiscountPriceScalarFieldEnum {
    discountId = "discountId",
    priceId = "priceId"
}


registerEnumType(MembershipDiscountPriceScalarFieldEnum, { name: 'MembershipDiscountPriceScalarFieldEnum', description: undefined })
