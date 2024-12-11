import { registerEnumType } from '@nestjs/graphql';

export enum BankAccountScalarFieldEnum {
    id = "id",
    name = "name",
    bankManagerId = "bankManagerId",
    accountName = "accountName",
    accountNumber = "accountNumber",
    balance = "balance",
    createdAt = "createdAt",
    updatedAt = "updatedAt",
    fullName = "fullName"
}


registerEnumType(BankAccountScalarFieldEnum, { name: 'BankAccountScalarFieldEnum', description: undefined })
