import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { AutoBankManagerThirdParty } from '../prisma/auto-bank-manager-third-party.enum';
import { BankManager } from '../bank-manager/bank-manager.model';

@ObjectType()
export class AutoBankManager {

    @Field(() => String, {nullable:false})
    id!: string;

    @Field(() => String, {nullable:false})
    apiKey!: string;

    @Field(() => AutoBankManagerThirdParty, {defaultValue:'CASSO',nullable:false})
    thirdParty!: `${AutoBankManagerThirdParty}`;

    @Field(() => String, {nullable:false})
    bankManagerId!: string;

    @Field(() => BankManager, {nullable:false})
    bankManager?: BankManager;
}
