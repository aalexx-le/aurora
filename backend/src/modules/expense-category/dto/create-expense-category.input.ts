import { ArgsType, Field, InputType, OmitType } from "@nestjs/graphql";
import { ExpenseCategory } from "src/entities/expense-category";

@InputType()
export class CreateExpenseCategoryInput extends OmitType(
    ExpenseCategory,
    ["id", "expenses", "user"] as const,
    InputType,
) {}

@ArgsType()
export class CreateExpenseCategoryArgs {
    @Field(() => CreateExpenseCategoryInput)
    data: CreateExpenseCategoryInput;
}
