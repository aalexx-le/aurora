import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { BankAccount } from '../bank-account/bank-account.model';
import { User } from '../user/user.model';

@ObjectType()
export class BankManager {

    @Field(() => String, {nullable:false})
    id!: string;

    @Field(() => String, {nullable:false})
    name!: string;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date;

    @Field(() => String, {nullable:false})
    apiKey!: string;

    @Field(() => Int, {nullable:false})
    userId!: number;

    @Field(() => [BankAccount], {nullable:true})
    banks?: Array<BankAccount>;

    @Field(() => User, {nullable:false})
    user?: User;
}
