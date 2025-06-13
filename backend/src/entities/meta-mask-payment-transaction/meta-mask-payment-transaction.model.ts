import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { PaymentTransaction } from '../payment-transaction/payment-transaction.model';

@ObjectType()
export class MetaMaskPaymentTransaction {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => Int, {nullable:false})
    paymentTransactionId!: number;

    @Field(() => String, {nullable:false})
    transactionHash!: string;

    @Field(() => String, {nullable:true})
    tokenAddress!: string | null;

    @Field(() => String, {nullable:false})
    tokenSymbol!: string;

    @Field(() => Int, {nullable:true})
    blockNumber!: number | null;

    @Field(() => String, {nullable:true})
    gasUsed!: string | null;

    @Field(() => String, {nullable:true})
    gasPrice!: string | null;

    @Field(() => PaymentTransaction, {nullable:false})
    paymentTransaction?: PaymentTransaction;
}
