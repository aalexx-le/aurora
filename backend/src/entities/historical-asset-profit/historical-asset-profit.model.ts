import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Float } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { AssetInfo } from '../asset-info/asset-info.model';
import { CryptoPortfolio } from '../crypto-portfolio/crypto-portfolio.model';

@ObjectType()
export class HistoricalAssetProfit {

    @Field(() => Date, {nullable:false})
    time!: Date;

    @Field(() => Float, {nullable:false})
    estimatedProfit!: number;

    @Field(() => Float, {nullable:false})
    totalCostInQuoteQty!: number;

    @Field(() => Float, {nullable:false})
    remainingQty!: number;

    @Field(() => String, {nullable:false})
    assetInfoId!: string;

    @Field(() => String, {nullable:false})
    cryptoPortfolioId!: string;

    @Field(() => Float, {nullable:true})
    realizedPnl!: number | null;

    @Field(() => Float, {nullable:true})
    unrealizedPnl!: number | null;

    @Field(() => Float, {nullable:true})
    totalPnl!: number | null;

    @Field(() => Float, {nullable:true})
    averageCostBasis!: number | null;

    @Field(() => Float, {nullable:true})
    currentPrice!: number | null;

    @Field(() => Float, {nullable:true})
    percentageGain!: number | null;

    @Field(() => Int, {nullable:true})
    holdingPeriodDays!: number | null;

    @Field(() => AssetInfo, {nullable:false})
    assetInfo?: AssetInfo;

    @Field(() => CryptoPortfolio, {nullable:false})
    cryptoPortfolio?: CryptoPortfolio;
}
