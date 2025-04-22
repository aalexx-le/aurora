import { registerEnumType } from '@nestjs/graphql';

export enum MembershipFeatureScalarFieldEnum {
    id = "id",
    planId = "planId",
    featureId = "featureId"
}


registerEnumType(MembershipFeatureScalarFieldEnum, { name: 'MembershipFeatureScalarFieldEnum', description: undefined })
