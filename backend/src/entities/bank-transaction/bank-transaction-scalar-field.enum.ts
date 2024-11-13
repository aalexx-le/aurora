import { registerEnumType } from '@nestjs/graphql';

export enum BankTransactionScalarFieldEnum {
    id = "id",
    bankId = "bankId",
    amount = "amount",
    description = "description",
    spentAmount = "spentAmount",
    createdAt = "createdAt"
}


registerEnumType(BankTransactionScalarFieldEnum, { name: 'BankTransactionScalarFieldEnum', description: undefined })
