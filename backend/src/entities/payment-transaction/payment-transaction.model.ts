import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { GraphQLDecimal } from 'prisma-graphql-type-decimal';
import { Decimal } from '@prisma/client/runtime/library';
import { PaymentStatus } from '../prisma/payment-status.enum';
import { PaddlePaymentTransaction } from '../paddle-payment-transaction/paddle-payment-transaction.model';
import { MetaMaskPaymentTransaction } from '../meta-mask-payment-transaction/meta-mask-payment-transaction.model';
import { MembershipSubscription } from '../membership-subscription/membership-subscription.model';

@ObjectType()
export class PaymentTransaction {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => String, {nullable:false})
    membershipSubscriptionId!: string;

    @Field(() => Int, {nullable:false})
    userId!: number;

    @Field(() => GraphQLDecimal, {nullable:false})
    amount!: Decimal;

    @Field(() => String, {nullable:false})
    currency!: string;

    @Field(() => PaymentStatus, {nullable:false})
    status!: `${PaymentStatus}`;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date;

    @Field(() => PaddlePaymentTransaction, {nullable:true})
    paddlePaymentTransaction?: PaddlePaymentTransaction | null;

    @Field(() => MetaMaskPaymentTransaction, {nullable:true})
    metaMaskPaymentTransaction?: MetaMaskPaymentTransaction | null;

    @Field(() => MembershipSubscription, {nullable:false})
    membershipSubscription?: MembershipSubscription;
}
