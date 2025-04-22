import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { PaymentProvider } from '../prisma/payment-provider.enum';
import { User } from '../user/user.model';
import { PaddlePaymentMethod } from '../paddle-payment-method/paddle-payment-method.model';

@ObjectType()
export class PaymentMethod {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => Int, {nullable:false})
    userId!: number;

    @Field(() => PaymentProvider, {nullable:false})
    provider!: `${PaymentProvider}`;

    @Field(() => User, {nullable:false})
    user?: User;

    @Field(() => PaddlePaymentMethod, {nullable:true})
    paddlePaymentMethod?: PaddlePaymentMethod | null;
}
