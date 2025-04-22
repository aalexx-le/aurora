import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { Interval } from '../prisma/interval.enum';
import { MembershipPrice } from '../membership-price/membership-price.model';

@ObjectType()
export class TimePeriod {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => Interval, {nullable:false})
    interval!: `${Interval}`;

    @Field(() => Int, {nullable:false})
    frequency!: number;

    @Field(() => [MembershipPrice], {nullable:true})
    billingCycles?: Array<MembershipPrice>;

    @Field(() => [MembershipPrice], {nullable:true})
    trialPeriods?: Array<MembershipPrice>;
}
