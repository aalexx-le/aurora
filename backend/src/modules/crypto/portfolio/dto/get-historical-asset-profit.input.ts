import { ArgsType, Field, InputType, PickType } from "@nestjs/graphql";
import { HistoricalAssetProfit } from "../../../../entities/historical-asset-profit";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

@InputType()
export class GetHistoricalAssetProfitInput extends PickType(
    HistoricalAssetProfit,
    ["cryptoPortfolioId", "assetInfoId"],
    InputType,
) {
    @Field(() => String)
    timeFrame: string;
}

@ArgsType()
export class GetHistoricalAssetProfitArgs {
    @ValidateNested()
    @Field(() => GetHistoricalAssetProfitInput, { nullable: false })
    @Type(() => GetHistoricalAssetProfitInput)
    data!: GetHistoricalAssetProfitInput;
}
