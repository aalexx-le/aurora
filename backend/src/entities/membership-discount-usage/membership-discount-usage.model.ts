import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { GraphQLDecimal } from 'prisma-graphql-type-decimal';
import { Decimal } from '@prisma/client/runtime/library';
import { MembershipDiscount } from '../membership-discount/membership-discount.model';
import { MembershipSubscription } from '../membership-subscription/membership-subscription.model';

@ObjectType()
export class MembershipDiscountUsage {

    @Field(() => String, {nullable:false})
    discountId!: string;

    @Field(() => String, {nullable:false})
    membershipSubscriptionId!: string;

    @Field(() => GraphQLDecimal, {nullable:false})
    originalAmount!: Decimal;

    @Field(() => GraphQLDecimal, {nullable:false})
    discountAmount!: Decimal;

    @Field(() => GraphQLDecimal, {nullable:false})
    finalAmount!: Decimal;

    @Field(() => String, {nullable:false})
    currencyCode!: string;

    @Field(() => Date, {nullable:false})
    usedAt!: Date;

    @Field(() => String, {nullable:true})
    ipAddress!: string | null;

    @Field(() => String, {nullable:true})
    userAgent!: string | null;

    @Field(() => MembershipDiscount, {nullable:false})
    discount?: MembershipDiscount;

    @Field(() => MembershipSubscription, {nullable:false})
    membershipSubscription?: MembershipSubscription;
}
