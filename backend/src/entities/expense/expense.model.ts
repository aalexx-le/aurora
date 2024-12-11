import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { Float } from '@nestjs/graphql';
import { BankTransaction } from '../bank-transaction/bank-transaction.model';
import { ExpenseCategory } from '../expense-category/expense-category.model';
import { User } from '../user/user.model';

@ObjectType()
export class Expense {

    @Field(() => String, {nullable:false})
    id!: string;

    @Field(() => Int, {nullable:false})
    userId!: number;

    @Field(() => String, {nullable:false})
    categoryId!: string;

    @Field(() => String, {nullable:false})
    name!: string;

    @Field(() => String, {nullable:true})
    description!: string | null;

    @Field(() => Float, {nullable:false})
    amount!: number;

    @Field(() => String, {nullable:false})
    bankTransactionId!: string;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => BankTransaction, {nullable:false})
    bankTransaction?: BankTransaction;

    @Field(() => ExpenseCategory, {nullable:false})
    category?: ExpenseCategory;

    @Field(() => User, {nullable:false})
    user?: User;
}
