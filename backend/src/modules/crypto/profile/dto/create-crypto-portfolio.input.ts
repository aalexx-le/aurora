import {
    ArgsType,
    Field,
    InputType,
    Int,
    IntersectionType,
    ObjectType,
    PickType,
} from "@nestjs/graphql";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CryptoPortfolio } from "src/entities/crypto-portfolio";
import { OKXCryptoPortfolio } from "../../../../entities/okx-crypto-portfolio";

@InputType()
export class CreateCryptoPortfolioInput extends PickType(
    CryptoPortfolio,
    ["userId", "name", "apiKey", "secretKey", "exchanges"],
    InputType,
) {}

@InputType()
export class CreateOKXCryptoPortfolioInput extends IntersectionType(
    CreateCryptoPortfolioInput,
    PickType(OKXCryptoPortfolio, ["passphrase"], InputType),
) {}

@ArgsType()
export class CreateCryptoPortfolioArgs {
    @ValidateNested()
    @Field(() => CreateCryptoPortfolioInput, { nullable: false })
    @Type(() => CreateCryptoPortfolioInput)
    data!: CreateCryptoPortfolioInput;
}

@ArgsType()
export class CreateOKXCryptoPortfolioArgs {
    @ValidateNested()
    @Field(() => CreateOKXCryptoPortfolioInput, { nullable: false })
    @Type(() => CreateOKXCryptoPortfolioInput)
    data!: CreateOKXCryptoPortfolioInput;
}

@ObjectType()
export class CreateCryptoRes {
    @Field()
    userId: number;
}
