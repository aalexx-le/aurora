import { ArgsType, Field, InputType, PickType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { BankTransaction } from "src/entities/bank-transaction";

@InputType()
export class CreateBankTransactionInput extends PickType(
    BankTransaction,
    ["bankId", "amount", "description"] as const,
    InputType,
) {}

@ArgsType()
export class CreateBankTransactionArgs {
    @Field(() => CreateBankTransactionInput)
    @ValidateNested()
    @Type(() => CreateBankTransactionInput)
    data!: CreateBankTransactionInput;
}
