import {
    ArgsType,
    Field,
    InputType,
    PartialType,
    PickType,
} from "@nestjs/graphql";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { AssetPrice } from "src/entities/asset-price";
import { Trade } from "../../../../entities/trade";

@InputType()
export class GetTradeInput extends PickType(
    PartialType(Trade),
    ["assetInfoId", "cryptoPortfolioId"],
    InputType,
) {
    @Field(() => String, { nullable: true })
    cryptoPortfolioId?: string;
}

@ArgsType()
export class GetTradeArgs {
    @ValidateNested()
    @Field(() => GetTradeInput, { nullable: false })
    @Type(() => GetTradeInput)
    data!: GetTradeInput;
}
