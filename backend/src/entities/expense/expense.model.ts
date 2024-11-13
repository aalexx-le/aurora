import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { Float } from '@nestjs/graphql';
import { ExpenseCategory } from '../expense-category/expense-category.model';
import { User } from '../user/user.model';
import { BankTransaction } from '../bank-transaction/bank-transaction.model';

@ObjectType()
export class Expense {

    @Field(() => String, {nullable:false})
    id!: string;

    @Field(() => Int, {nullable:false})
    userId!: number;

    @Field(() => String, {nullable:false})
    categoryId!: string;

    @Field(() => String, {nullable:false})
    bankTransactionId!: string;

    @Field(() => String, {nullable:false})
    name!: string;

    @Field(() => String, {nullable:true})
    description!: string | null;

    @Field(() => Float, {nullable:false})
    amount!: number;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => ExpenseCategory, {nullable:false})
    category?: ExpenseCategory;

    @Field(() => User, {nullable:false})
    user?: User;

    @Field(() => BankTransaction, {nullable:false})
    bankTransaction?: BankTransaction;
}
