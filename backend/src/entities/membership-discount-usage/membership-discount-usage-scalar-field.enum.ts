import { registerEnumType } from '@nestjs/graphql';

export enum MembershipDiscountUsageScalarFieldEnum {
    discountId = "discountId",
    membershipSubscriptionId = "membershipSubscriptionId",
    originalAmount = "originalAmount",
    discountAmount = "discountAmount",
    finalAmount = "finalAmount",
    currencyCode = "currencyCode",
    usedAt = "usedAt",
    ipAddress = "ipAddress",
    userAgent = "userAgent"
}


registerEnumType(MembershipDiscountUsageScalarFieldEnum, { name: 'MembershipDiscountUsageScalarFieldEnum', description: undefined })
