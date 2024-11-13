import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { Expense } from '../expense/expense.model';
import { User } from '../user/user.model';

@ObjectType()
export class ExpenseCategory {

    @Field(() => String, {nullable:false})
    id!: string;

    @Field(() => Int, {nullable:false})
    userId!: number;

    @Field(() => String, {nullable:false})
    name!: string;

    @Field(() => String, {nullable:false})
    color!: string;

    @Field(() => String, {nullable:true})
    description!: string | null;

    @Field(() => [Expense], {nullable:true})
    expenses?: Array<Expense>;

    @Field(() => User, {nullable:false})
    user?: User;
}
