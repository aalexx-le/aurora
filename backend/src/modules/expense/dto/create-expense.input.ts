import { ArgsType, Field, InputType, OmitType } from "@nestjs/graphql";
import { Expense } from "src/entities/expense";

@InputType()
export class CreateExpenseInput extends OmitType(
    Expense,
    ["id", "category", "user", "bankTransaction", "createdAt"],
    InputType,
) {}

@ArgsType()
export class CreateExpenseArgs {
    @Field(() => CreateExpenseInput)
    data!: CreateExpenseInput;
}
