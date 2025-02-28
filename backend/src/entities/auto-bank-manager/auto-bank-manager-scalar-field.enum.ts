import { registerEnumType } from '@nestjs/graphql';

export enum AutoBankManagerScalarFieldEnum {
    id = "id",
    apiKey = "apiKey",
    thirdParty = "thirdParty",
    bankManagerId = "bankManagerId"
}


registerEnumType(AutoBankManagerScalarFieldEnum, { name: 'AutoBankManagerScalarFieldEnum', description: undefined })
