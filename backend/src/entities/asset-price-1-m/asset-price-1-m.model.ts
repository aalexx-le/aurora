import { Field, Float, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class asset_price_1M {

    @Field(() => Date, {nullable:false})
    open_time!: Date;

    @Field(() => String, {nullable:false})
    assetInfoId!: string;

    @Field(() => Float, {nullable:true})
    openPrice!: number | null;

    @Field(() => Float, {nullable:true})
    closePrice!: number | null;

    @Field(() => Float, {nullable:true})
    highPrice!: number | null;

    @Field(() => Float, {nullable:true})
    lowPrice!: number | null;

    @Field(() => Float, {nullable:true})
    volume!: number | null;
}
