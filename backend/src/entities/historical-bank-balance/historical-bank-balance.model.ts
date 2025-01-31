import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Float } from '@nestjs/graphql';
import { BankAccount } from '../bank-account/bank-account.model';

@ObjectType()
export class HistoricalBankBalance {

    @Field(() => Date, {nullable:false})
    time!: Date;

    @Field(() => Float, {nullable:false})
    balance!: number;

    @Field(() => String, {nullable:false})
    bankAccountId!: string;

    @Field(() => BankAccount, {nullable:false})
    bankAccount?: BankAccount;
}
