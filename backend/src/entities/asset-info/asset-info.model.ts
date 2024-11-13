import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { AssetBalance } from '../asset-balance/asset-balance.model';
import { AssetPrice } from '../asset-price/asset-price.model';

@ObjectType()
export class AssetInfo {

    @Field(() => String, {nullable:false})
    id!: string;

    @Field(() => String, {nullable:false})
    name!: string;

    @Field(() => String, {nullable:false})
    symbol!: string;

    @Field(() => String, {nullable:false})
    category!: string;

    @Field(() => String, {nullable:false})
    desc!: string;

    @Field(() => String, {nullable:false})
    logo!: string;

    @Field(() => [AssetBalance], {nullable:true})
    assetBalances?: Array<AssetBalance>;

    @Field(() => [AssetPrice], {nullable:true})
    assetPrices?: Array<AssetPrice>;
}
