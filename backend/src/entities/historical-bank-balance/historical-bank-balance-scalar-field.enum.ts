import { registerEnumType } from '@nestjs/graphql';

export enum HistoricalBankBalanceScalarFieldEnum {
    time = "time",
    balance = "balance",
    bankAccountId = "bankAccountId"
}


registerEnumType(HistoricalBankBalanceScalarFieldEnum, { name: 'HistoricalBankBalanceScalarFieldEnum', description: undefined })
