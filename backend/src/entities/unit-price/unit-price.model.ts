import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { MembershipPrice } from '../membership-price/membership-price.model';

@ObjectType()
export class UnitPrice {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => String, {nullable:false})
    amount!: string;

    @Field(() => String, {nullable:false})
    currencyCode!: string;

    @Field(() => [MembershipPrice], {nullable:true})
    prices?: Array<MembershipPrice>;
}
