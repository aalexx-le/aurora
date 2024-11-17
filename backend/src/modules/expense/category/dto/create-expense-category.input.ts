import { ArgsType, Field, InputType, OmitType } from "@nestjs/graphql";
import { ExpenseCategory } from "src/entities/expense-category";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

@InputType()
export class CreateExpenseCategoryInput extends OmitType(
    ExpenseCategory,
    ["id", "expenses", "user", "monthlyTargets"] as const,
    InputType,
) {}

@ArgsType()
export class CreateExpenseCategoryArgs {
    @Field(() => CreateExpenseCategoryInput)
    @ValidateNested()
    @Type(() => CreateExpenseCategoryInput)
    data: CreateExpenseCategoryInput;
}
