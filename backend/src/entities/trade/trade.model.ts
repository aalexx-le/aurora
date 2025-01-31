import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Float } from '@nestjs/graphql';
import { CryptoPortfolio } from '../crypto-portfolio/crypto-portfolio.model';
import { AssetInfo } from '../asset-info/asset-info.model';

@ObjectType()
export class Trade {

    @Field(() => String, {nullable:false})
    cryptoPortfolioId!: string;

    @Field(() => String, {nullable:false})
    assetInfoId!: string;

    @Field(() => Float, {nullable:false})
    price!: number;

    @Field(() => Float, {nullable:false})
    qty!: number;

    @Field(() => Float, {nullable:false})
    quoteQty!: number;

    @Field(() => Float, {nullable:false})
    commission!: number;

    @Field(() => String, {nullable:false})
    commissionAsset!: string;

    @Field(() => Date, {nullable:false})
    time!: Date;

    @Field(() => Boolean, {nullable:false})
    isBuyer!: boolean;

    @Field(() => CryptoPortfolio, {nullable:false})
    cryptoPortfolio?: CryptoPortfolio;

    @Field(() => AssetInfo, {nullable:false})
    assetInfo?: AssetInfo;
}
