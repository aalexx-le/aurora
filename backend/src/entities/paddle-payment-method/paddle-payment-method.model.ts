import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { PaymentMethod } from '../payment-method/payment-method.model';

@ObjectType()
export class PaddlePaymentMethod {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => Int, {nullable:false})
    paymentMethodId!: number;

    @Field(() => String, {nullable:false})
    customerId!: string;

    @Field(() => String, {nullable:true})
    addressId!: string | null;

    @Field(() => String, {nullable:true})
    businessId!: string | null;

    @Field(() => PaymentMethod, {nullable:false})
    paymentMethod?: PaymentMethod;
}
