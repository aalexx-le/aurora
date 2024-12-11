import {
    ArgsType,
    Field,
    InputType,
    Int,
    ObjectType,
    PickType,
} from "@nestjs/graphql";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CryptoPortfolio } from "src/entities/crypto-portfolio";

@InputType()
export class CreateCryptoPortfolioInput extends PickType(
    CryptoPortfolio,
    ["userId", "apiKey", "secretKey", "exchanges"],
    InputType,
) {}

@ArgsType()
export class CreateCryptoPortfolioArgs {
    @ValidateNested()
    @Field(() => CreateCryptoPortfolioInput, { nullable: false })
    @Type(() => CreateCryptoPortfolioInput)
    data!: CreateCryptoPortfolioInput;
}

@ObjectType()
export class CreateCryptoRes {
    @Field()
    userId: number;
}
