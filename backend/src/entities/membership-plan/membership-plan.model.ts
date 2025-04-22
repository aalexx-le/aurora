import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { MembershipSubscription } from '../membership-subscription/membership-subscription.model';
import { MembershipPrice } from '../membership-price/membership-price.model';
import { MembershipFeature } from '../membership-feature/membership-feature.model';

@ObjectType()
export class MembershipPlan {

    @Field(() => String, {nullable:false})
    id!: string;

    @Field(() => String, {nullable:false})
    name!: string;

    @Field(() => String, {nullable:true})
    description!: string | null;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date;

    @Field(() => [MembershipSubscription], {nullable:true})
    subscriptions?: Array<MembershipSubscription>;

    @Field(() => [MembershipPrice], {nullable:true})
    prices?: Array<MembershipPrice>;

    @Field(() => [MembershipFeature], {nullable:true})
    membershipFeatures?: Array<MembershipFeature>;
}
