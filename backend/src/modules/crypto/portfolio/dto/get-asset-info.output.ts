import { Field, Float, ObjectType, OmitType } from "@nestjs/graphql";
import { AssetInfo } from "src/entities/asset-info";

@ObjectType()
export class AssetInfoOutput extends OmitType(
    AssetInfo,
    ["assetBalances", "assetPrices"],
    ObjectType,
) {
    @Field(() => Float, { nullable: false })
    lastPrice: number;
}
