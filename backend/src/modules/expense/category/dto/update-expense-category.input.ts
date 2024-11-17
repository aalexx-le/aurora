import { CreateExpenseCategoryInput } from "./create-expense-category.input";
import {
    ArgsType,
    Field,
    InputType,
    OmitType,
    PartialType,
    PickType,
} from "@nestjs/graphql";
import { ExpenseCategory } from "src/entities/expense-category";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

@InputType()
export class UpdateExpenseCategoryInput extends PartialType(
    OmitType(CreateExpenseCategoryInput, ["userId"] as const),
) {}

@ArgsType()
export class UpdateExpenseCategoryArgs extends PickType(
    ExpenseCategory,
    ["id"],
    ArgsType,
) {
    @Field(() => UpdateExpenseCategoryInput)
    @ValidateNested()
    @Type(() => UpdateExpenseCategoryInput)
    data!: UpdateExpenseCategoryInput;
}
