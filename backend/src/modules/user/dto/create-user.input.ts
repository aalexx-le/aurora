import { ArgsType, Field, InputType, OmitType } from "@nestjs/graphql";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { GetAssetInfoInput } from "../../crypto/asset/dto/get-asset-info.input";
import { User } from "src/entities/user";

@InputType()
export class CreateUserInput extends OmitType(
    User,
    ["id", "cryptoPortfolios", "expenseCategories", "bankManager", "expenses"],
    InputType,
) {}

@ArgsType()
export class CreateUserArgs {
    @Field(() => CreateUserInput, { nullable: false })
    @Type(() => GetAssetInfoInput)
    @ValidateNested()
    data!: CreateUserInput;
}
