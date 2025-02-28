import { registerEnumType } from '@nestjs/graphql';

export enum BankManagerScalarFieldEnum {
    id = "id",
    userId = "userId",
    name = "name",
    createdAt = "createdAt",
    updatedAt = "updatedAt"
}


registerEnumType(BankManagerScalarFieldEnum, { name: 'BankManagerScalarFieldEnum', description: undefined })
