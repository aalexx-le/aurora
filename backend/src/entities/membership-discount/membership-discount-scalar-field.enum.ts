import { registerEnumType } from '@nestjs/graphql';

export enum MembershipDiscountScalarFieldEnum {
    id = "id",
    name = "name",
    description = "description",
    code = "code",
    type = "type",
    value = "value",
    currencyCode = "currencyCode",
    maxAmount = "maxAmount",
    isActive = "isActive",
    startDate = "startDate",
    endDate = "endDate",
    maxUses = "maxUses",
    maxUsesPerUser = "maxUsesPerUser",
    currentUses = "currentUses",
    targetType = "targetType",
    createdAt = "createdAt",
    updatedAt = "updatedAt"
}


registerEnumType(MembershipDiscountScalarFieldEnum, { name: 'MembershipDiscountScalarFieldEnum', description: undefined })
