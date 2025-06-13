import {
    ArgsType,
    Field,
    InputType,
    IntersectionType,
    ObjectType,
    PickType,
} from "@nestjs/graphql";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { CryptoPortfolio } from "src/entities/crypto-portfolio";
import { PassphraseCryptoPortfolio } from "../../../../entities/passphrase-crypto-portfolio";

@InputType()
export class CreateCryptoPortfolioInput extends PickType(
    CryptoPortfolio,
    ["name", "apiKey", "secretKey", "exchanges"],
    InputType,
) {
    @Field(() => String, { nullable: true })
    passphrase?: string;
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
