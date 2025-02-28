import { ArgsType, Field, InputType, PickType } from "@nestjs/graphql";
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
    data!: CreateBankTransactionInput;
}
