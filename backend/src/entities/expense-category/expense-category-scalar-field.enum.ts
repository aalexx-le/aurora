import { registerEnumType } from '@nestjs/graphql';

export enum ExpenseCategoryScalarFieldEnum {
    id = "id",
    userId = "userId",
    name = "name",
    color = "color",
    description = "description"
}


registerEnumType(ExpenseCategoryScalarFieldEnum, { name: 'ExpenseCategoryScalarFieldEnum', description: undefined })
