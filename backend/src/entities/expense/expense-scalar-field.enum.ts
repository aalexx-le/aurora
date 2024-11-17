import { registerEnumType } from "@nestjs/graphql";

export enum ExpenseScalarFieldEnum {
    id = "id",
    userId = "userId",
    categoryId = "categoryId",
    name = "name",
    description = "description",
    amount = "amount",
    bankTransactionId = "bankTransactionId",
    createdAt = "createdAt"
}


registerEnumType(ExpenseScalarFieldEnum, { name: 'ExpenseScalarFieldEnum', description: undefined })
