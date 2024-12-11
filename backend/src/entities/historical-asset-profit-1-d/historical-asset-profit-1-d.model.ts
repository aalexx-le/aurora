import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Float } from '@nestjs/graphql';

@ObjectType()
export class historical_asset_profit_1d {

    @Field(() => Date, {nullable:false})
    time!: Date;

    @Field(() => String, {nullable:false})
    assetInfoId!: string;

    @Field(() => String, {nullable:false})
    cryptoPortfolioId!: string;

    @Field(() => Float, {nullable:true})
    estimatedProfit!: number | null;

    @Field(() => Float, {nullable:true})
    totalCostInQuoteQty!: number | null;

    @Field(() => Float, {nullable:true})
    remainingQty!: number | null;
}
