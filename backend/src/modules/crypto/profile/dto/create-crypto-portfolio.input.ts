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
export class CreateCryptoPortfolioInput extends PickType(CryptoPortfolio, [
    "userId",
    "apiKey",
    "secretKey",
]) {
    @Field(() => Int, { nullable: false })
    userId: number;

    @Field({ nullable: false })
    apiKey: string;

    @Field({ nullable: false })
    secretKey: string;
}

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
