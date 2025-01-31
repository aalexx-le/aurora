import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Float } from '@nestjs/graphql';
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

    @Field(() => AssetInfo, {nullable:false})
    assetInfo?: AssetInfo;

    @Field(() => CryptoPortfolio, {nullable:false})
    cryptoPortfolio?: CryptoPortfolio;
}
