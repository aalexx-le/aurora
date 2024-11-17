import { ArgsType, Field, PartialType, PickType } from "@nestjs/graphql";
import { ExpenseCategory } from "src/entities/expense-category";

@ArgsType()
export class GetExpenseCategoryArgs extends PickType(
    PartialType(ExpenseCategory),
    ["userId", "name"],
    ArgsType,
) {}

@ArgsType()
export class GetTotalAmountArgs {
    @Field(() => Date, { nullable: true })
    startDate?: Date;

    @Field(() => Date, { nullable: true })
    endDate?: Date;
}
