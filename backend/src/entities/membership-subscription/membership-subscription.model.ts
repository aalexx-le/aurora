import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { MembershipSubscriptionStatus } from '../prisma/membership-subscription-status.enum';
import { User } from '../user/user.model';
import { MembershipPlan } from '../membership-plan/membership-plan.model';
import { PaymentTransaction } from '../payment-transaction/payment-transaction.model';
import { MembershipDiscountUsage } from '../membership-discount-usage/membership-discount-usage.model';

@ObjectType()
export class MembershipSubscription {

    @Field(() => String, {nullable:false})
    id!: string;

    @Field(() => Int, {nullable:false})
    userId!: number;

    @Field(() => String, {nullable:false})
    planId!: string;

    @Field(() => MembershipSubscriptionStatus, {nullable:false})
    status!: `${MembershipSubscriptionStatus}`;

    @Field(() => Date, {nullable:false})
    startDate!: Date;

    @Field(() => Date, {nullable:false})
    endDate!: Date;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date;

    @Field(() => User, {nullable:false})
    user?: User;

    @Field(() => MembershipPlan, {nullable:false})
    plan?: MembershipPlan;

    @Field(() => [PaymentTransaction], {nullable:true})
    paymentTransactions?: Array<PaymentTransaction>;

    @Field(() => [MembershipDiscountUsage], {nullable:true})
    discountUsages?: Array<MembershipDiscountUsage>;
}
