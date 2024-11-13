import { ArgsType, Field, InputType, Int, PickType } from "@nestjs/graphql";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CryptoPortfolio } from "../../../../entities/crypto-portfolio";

@InputType()
export class GetCryptoPortfolioInput extends PickType(CryptoPortfolio, [
    "userId",
]) {
    @Field(() => Int, { nullable: false })
    userId: number;
}

@ArgsType()
export class GetCryptoPortfolioArgs {
    @ValidateNested()
    @Field(() => GetCryptoPortfolioInput, { nullable: false })
    @Type(() => GetCryptoPortfolioInput)
    data!: GetCryptoPortfolioInput;
}
