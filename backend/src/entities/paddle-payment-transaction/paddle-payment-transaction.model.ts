import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { PaymentTransaction } from '../payment-transaction/payment-transaction.model';

@ObjectType()
export class PaddlePaymentTransaction {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => Int, {nullable:false})
    paymentTransactionId!: number;

    @Field(() => PaymentTransaction, {nullable:false})
    paymentTransaction?: PaymentTransaction;
}
