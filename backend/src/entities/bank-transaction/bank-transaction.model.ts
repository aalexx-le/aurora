import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Float } from '@nestjs/graphql';
import { BankAccount } from '../bank-account/bank-account.model';
import { Expense } from '../expense/expense.model';

@ObjectType()
export class BankTransaction {

    @Field(() => String, {nullable:false})
    id!: string;

    @Field(() => String, {nullable:false})
    bankId!: string;

    @Field(() => Float, {nullable:false})
    amount!: number;

    @Field(() => String, {nullable:false})
    description!: string;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Float, {defaultValue:0,nullable:false})
    spentAmount!: number;

    @Field(() => BankAccount, {nullable:false})
    bank?: BankAccount;

    @Field(() => [Expense], {nullable:true})
    expense?: Array<Expense>;
}
