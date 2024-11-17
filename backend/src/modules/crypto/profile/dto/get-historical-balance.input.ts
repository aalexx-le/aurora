import { ArgsType, Field, InputType, PickType } from "@nestjs/graphql";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { HistoricalCryptoBalance } from "src/entities/historical-crypto-balance";

@InputType()
export class GetHistoricalBalanceInput extends PickType(
    HistoricalCryptoBalance,
    ["cryptoPortfolioId"],
    InputType,
) {
    @Field(() => String)
    timeFrame: string;
}

@ArgsType()
export class GetHistoricalBalanceArgs {
    @ValidateNested()
    @Field(() => GetHistoricalBalanceInput, { nullable: false })
    @Type(() => GetHistoricalBalanceInput)
    data!: GetHistoricalBalanceInput;
}
