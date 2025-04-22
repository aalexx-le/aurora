import { registerEnumType } from '@nestjs/graphql';

export enum MembershipPlanScalarFieldEnum {
    id = "id",
    name = "name",
    description = "description",
    createdAt = "createdAt",
    updatedAt = "updatedAt"
}


registerEnumType(MembershipPlanScalarFieldEnum, { name: 'MembershipPlanScalarFieldEnum', description: undefined })
