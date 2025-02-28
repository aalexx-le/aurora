import { ArgsType, Field, InputType, Int, PickType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { BankAccount } from "../../../../entities/bank-account";

@InputType()
export class CreateBankAccountInput extends PickType(
    BankAccount,
    [
        "accountName",
        "accountNumber",
        "balance",
        "name",
        "fullName",
        "bankManagerId",
    ],
    InputType,
) {}

@ArgsType()
export class CreateBankAccountArgs {
    @Field(() => CreateBankAccountInput)
    @ValidateNested()
    @Type(() => CreateBankAccountInput)
    data: CreateBankAccountInput;
}
