import { registerEnumType } from '@nestjs/graphql';

export enum ExpenseCategoryScalarFieldEnum {
    id = "id",
    userId = "userId",
    name = "name",
    description = "description",
    color = "color"
}


registerEnumType(ExpenseCategoryScalarFieldEnum, { name: 'ExpenseCategoryScalarFieldEnum', description: undefined })
