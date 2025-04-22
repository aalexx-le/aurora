import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { MembershipPlan } from '../membership-plan/membership-plan.model';
import { Feature } from '../feature/feature.model';

@ObjectType()
export class MembershipFeature {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => String, {nullable:false})
    planId!: string;

    @Field(() => Int, {nullable:false})
    featureId!: number;

    @Field(() => MembershipPlan, {nullable:false})
    plan?: MembershipPlan;

    @Field(() => Feature, {nullable:false})
    feature?: Feature;
}
