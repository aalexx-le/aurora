import { ArgsType, Field, InputType, PickType } from "@nestjs/graphql";
import { Expense } from "../../../entities/expense";

@InputType()
export class SuggestExpenseInput extends PickType(
    Expense,
    ["bankTransactionId"] as const,
    InputType,
) {}

@ArgsType()
export class SuggestExpenseArgs {
    @Field(() => SuggestExpenseInput)
    data!: SuggestExpenseInput;
}
