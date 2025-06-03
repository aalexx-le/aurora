import { ArgsType, Field, InputType, OmitType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { User } from "src/entities/user";
import { GetAssetInfoInput } from "../../crypto/asset/dto/get-asset-info.input";

@InputType()
export class CreateUserInput extends OmitType(
    User,
    [
        "id",
        "cryptoPortfolios",
        "createPortfolioExecutions",
        "expenseCategories",
        "bankManager",
        "expenses",
        "events",
        "eventRecurrences",
        "eventCategories",
        "memberships",
        "paymentMethods",
    ],
    InputType,
) {}

@InputType()
export class CreateUserInputWithoutOTP extends OmitType(CreateUserInput, [
    "otp",
    "otpPurpose",
]) {}

@ArgsType()
export class CreateUserArgs {
    @Field(() => CreateUserInput, { nullable: false })
    @Type(() => GetAssetInfoInput)
    @ValidateNested()
    data!: CreateUserInputWithoutOTP;
}
