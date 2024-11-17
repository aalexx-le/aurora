import { registerEnumType } from '@nestjs/graphql';

export enum BankTransactionScalarFieldEnum {
    id = "id",
    bankId = "bankId",
    amount = "amount",
    description = "description",
    createdAt = "createdAt",
    spentAmount = "spentAmount"
}


registerEnumType(BankTransactionScalarFieldEnum, { name: 'BankTransactionScalarFieldEnum', description: undefined })
