import { registerEnumType } from '@nestjs/graphql';

export enum MembershipPriceScalarFieldEnum {
    id = "id",
    planId = "planId",
    billingCycleId = "billingCycleId",
    trialPeriodId = "trialPeriodId",
    unitPriceId = "unitPriceId",
    status = "status",
    createdAt = "createdAt"
}


registerEnumType(MembershipPriceScalarFieldEnum, { name: 'MembershipPriceScalarFieldEnum', description: undefined })
