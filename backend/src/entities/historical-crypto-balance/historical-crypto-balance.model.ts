import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Float } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { CryptoPortfolio } from '../crypto-portfolio/crypto-portfolio.model';

@ObjectType()
export class HistoricalCryptoBalance {

    @Field(() => Date, {nullable:false})
    time!: Date;

    @Field(() => Float, {nullable:false})
    estimatedBalance!: number;

    @Field(() => Float, {nullable:false})
    changePercent!: number;

    @Field(() => Float, {nullable:false})
    changeBalance!: number;

    @Field(() => String, {nullable:false})
    cryptoPortfolioId!: string;

    @Field(() => Float, {nullable:true})
    totalValue!: number | null;

    @Field(() => Float, {nullable:true})
    totalPnl!: number | null;

    @Field(() => Float, {nullable:true})
    totalRealizedPnl!: number | null;

    @Field(() => Float, {nullable:true})
    totalUnrealizedPnl!: number | null;

    @Field(() => Int, {nullable:true})
    assetCount!: number | null;

    @Field(() => Float, {nullable:true})
    diversificationScore!: number | null;

    @Field(() => Float, {nullable:true})
    riskScore!: number | null;

    @Field(() => CryptoPortfolio, {nullable:false})
    cryptoPortfolio?: CryptoPortfolio;
}
