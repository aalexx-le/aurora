import { registerEnumType } from '@nestjs/graphql';

export enum PlanPriceScalarFieldEnum {
    id = "id",
    planId = "planId",
    billingCycleId = "billingCycleId",
    trialPeriodId = "trialPeriodId",
    unitPriceId = "unitPriceId",
    status = "status",
    createdAt = "createdAt"
}


registerEnumType(PlanPriceScalarFieldEnum, { name: 'PlanPriceScalarFieldEnum', description: undefined })
