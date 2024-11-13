import { registerEnumType } from '@nestjs/graphql';

export enum BankAccountScalarFieldEnum {
    id = "id",
    name = "name",
    fullName = "fullName",
    bankManagerId = "bankManagerId",
    accountName = "accountName",
    accountNumber = "accountNumber",
    balance = "balance",
    createdAt = "createdAt",
    updatedAt = "updatedAt"
}


registerEnumType(BankAccountScalarFieldEnum, { name: 'BankAccountScalarFieldEnum', description: undefined })
