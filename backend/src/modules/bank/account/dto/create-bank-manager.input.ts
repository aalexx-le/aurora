import { ArgsType, Field, InputType, PickType } from "@nestjs/graphql";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { BankManager } from "../../../../entities/bank-manager";
import { AutoBankManager } from "../../../../entities/auto-bank-manager";

@InputType()
export class CreateAutoBankManagerInput extends PickType(
    AutoBankManager,
    ["apiKey", "thirdParty"],
    InputType,
) {}

@InputType()
export class CreateBankManagerInput extends PickType(
    BankManager,
    ["name"],
    InputType,
) {
    @Field(() => CreateAutoBankManagerInput, { nullable: true })
    autoBankManager?: CreateAutoBankManagerInput;
}

@ArgsType()
export class CreateBankManagerArgs {
    @Field(() => CreateBankManagerInput)
    @ValidateNested()
    @Type(() => CreateBankManagerInput)
    data: CreateBankManagerInput;
}
