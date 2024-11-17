import { registerEnumType } from "@nestjs/graphql";

export enum BankManagerScalarFieldEnum {
    id = "id",
    name = "name",
    createdAt = "createdAt",
    updatedAt = "updatedAt",
    apiKey = "apiKey",
    userId = "userId"
}


registerEnumType(BankManagerScalarFieldEnum, { name: 'BankManagerScalarFieldEnum', description: undefined })
