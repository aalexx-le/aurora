import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { Float } from '@nestjs/graphql';
import { ExpenseCategory } from '../expense-category/expense-category.model';

@ObjectType()
export class MonthlyTarget {

    @Field(() => String, {nullable:false})
    id!: string;

    @Field(() => String, {nullable:false})
    categoryId!: string;

    @Field(() => Int, {nullable:false})
    month!: number;

    @Field(() => Int, {nullable:false})
    year!: number;

    @Field(() => Float, {nullable:false})
    target!: number;

    @Field(() => ExpenseCategory, {nullable:false})
    category?: ExpenseCategory;
}
