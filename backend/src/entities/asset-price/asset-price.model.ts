import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Float } from '@nestjs/graphql';
import { AssetInfo } from '../asset-info/asset-info.model';

@ObjectType()
export class AssetPrice {

    @Field(() => String, {nullable:false})
    assetInfoId!: string;

    @Field(() => String, {nullable:false})
    interval!: string;

    @Field(() => Date, {nullable:false})
    open_time!: Date;

    @Field(() => Date, {nullable:false})
    close_time!: Date;

    @Field(() => Float, {nullable:false})
    openPrice!: number;

    @Field(() => Float, {nullable:false})
    closePrice!: number;

    @Field(() => Float, {nullable:false})
    highPrice!: number;

    @Field(() => Float, {nullable:false})
    lowPrice!: number;

    @Field(() => Float, {nullable:false})
    volume!: number;

    @Field(() => AssetInfo, {nullable:false})
    assetInfo?: AssetInfo;
}
