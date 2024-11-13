import { registerEnumType } from '@nestjs/graphql';

export enum ExpenseScalarFieldEnum {
    id = "id",
    userId = "userId",
    categoryId = "categoryId",
    bankTransactionId = "bankTransactionId",
    name = "name",
    description = "description",
    amount = "amount",
    createdAt = "createdAt"
}


registerEnumType(ExpenseScalarFieldEnum, { name: 'ExpenseScalarFieldEnum', description: undefined })
