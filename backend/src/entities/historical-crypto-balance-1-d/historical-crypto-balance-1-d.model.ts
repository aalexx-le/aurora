import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Float } from '@nestjs/graphql';

@ObjectType()
export class historical_crypto_balance_1d {

    @Field(() => Date, {nullable:false})
    time!: Date;

    @Field(() => Float, {nullable:true})
    estimatedBalance!: number | null;

    @Field(() => Float, {nullable:true})
    changeBalance!: number | null;

    @Field(() => Float, {nullable:true})
    changePercent!: number | null;

    @Field(() => String, {nullable:false})
    cryptoPortfolioId!: string;
}
