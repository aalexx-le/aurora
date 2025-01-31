import { registerEnumType } from '@nestjs/graphql';

export enum MonthlyTargetScalarFieldEnum {
    id = "id",
    categoryId = "categoryId",
    month = "month",
    year = "year",
    target = "target"
}


registerEnumType(MonthlyTargetScalarFieldEnum, { name: 'MonthlyTargetScalarFieldEnum', description: undefined })
