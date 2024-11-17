import { ArgsType, Field, InputType, PickType } from "@nestjs/graphql";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { AssetPrice } from "src/entities/asset-price";

@InputType()
export class GetAssetPriceInput extends PickType(
    AssetPrice,
    ["assetInfoId"],
    InputType,
) {
    @Field(() => String)
    timeFrame: string;
}

@ArgsType()
export class GetAssetPriceArgs {
    @ValidateNested()
    @Field(() => GetAssetPriceInput, { nullable: false })
    @Type(() => GetAssetPriceInput)
    data!: GetAssetPriceInput;
}
