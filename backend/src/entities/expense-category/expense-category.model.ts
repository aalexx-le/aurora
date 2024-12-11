import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { Expense } from '../expense/expense.model';
import { User } from '../user/user.model';
import { MonthlyTarget } from '../monthly-target/monthly-target.model';

@ObjectType()
export class ExpenseCategory {

    @Field(() => String, {nullable:false})
    id!: string;

    @Field(() => Int, {nullable:false})
    userId!: number;

    @Field(() => String, {nullable:false})
    name!: string;

    @Field(() => String, {nullable:true})
    description!: string | null;

    @Field(() => String, {nullable:false})
    color!: string;

    @Field(() => [Expense], {nullable:true})
    expenses?: Array<Expense>;

    @Field(() => User, {nullable:false})
    user?: User;

    @Field(() => [MonthlyTarget], {nullable:true})
    monthlyTargets?: Array<MonthlyTarget>;
}
