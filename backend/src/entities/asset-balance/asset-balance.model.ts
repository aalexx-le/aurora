import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Float } from '@nestjs/graphql';
import { AssetInfo } from '../asset-info/asset-info.model';
import { CryptoPortfolio } from '../crypto-portfolio/crypto-portfolio.model';

@ObjectType()
export class AssetBalance {

    @Field(() => String, {nullable:false})
    id!: string;

    @Field(() => String, {nullable:false})
    assetInfoId!: string;

    @Field(() => Float, {nullable:false})
    balance!: number;

    @Field(() => Float, {nullable:false})
    locked!: number;

    @Field(() => String, {nullable:false})
    cryptoPortfolioId!: string;

    @Field(() => AssetInfo, {nullable:false})
    assetInfo?: AssetInfo;

    @Field(() => CryptoPortfolio, {nullable:false})
    cryptoPortfolio?: CryptoPortfolio;
}
