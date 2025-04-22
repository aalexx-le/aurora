import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { PriceStatus } from '../prisma/price-status.enum';
import { TimePeriod } from '../time-period/time-period.model';
import { UnitPrice } from '../unit-price/unit-price.model';
import { MembershipPlan } from '../membership-plan/membership-plan.model';

@ObjectType()
export class MembershipPrice {

    @Field(() => String, {nullable:false})
    id!: string;

    @Field(() => String, {nullable:false})
    planId!: string;

    @Field(() => Int, {nullable:true})
    billingCycleId!: number | null;

    @Field(() => Int, {nullable:true})
    trialPeriodId!: number | null;

    @Field(() => Int, {nullable:false})
    unitPriceId!: number;

    @Field(() => PriceStatus, {defaultValue:'active',nullable:false})
    status!: `${PriceStatus}`;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => TimePeriod, {nullable:true})
    billingCycle?: TimePeriod | null;

    @Field(() => TimePeriod, {nullable:true})
    trialPeriod?: TimePeriod | null;

    @Field(() => UnitPrice, {nullable:false})
    unitPrice?: UnitPrice;

    @Field(() => MembershipPlan, {nullable:false})
    plan?: MembershipPlan;
}
