import { registerEnumType } from '@nestjs/graphql';

export enum AutoBankManagerThirdParty {
    CASSO = "CASSO"
}


registerEnumType(AutoBankManagerThirdParty, { name: 'AutoBankManagerThirdParty', description: undefined })
