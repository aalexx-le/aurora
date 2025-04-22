import { registerEnumType } from '@nestjs/graphql';

export enum MembershipSubscriptionScalarFieldEnum {
    id = "id",
    userId = "userId",
    planId = "planId",
    status = "status",
    startDate = "startDate",
    endDate = "endDate",
    createdAt = "createdAt",
    updatedAt = "updatedAt"
}


registerEnumType(MembershipSubscriptionScalarFieldEnum, { name: 'MembershipSubscriptionScalarFieldEnum', description: undefined })
