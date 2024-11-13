import { CreateExpenseInput } from "./create-expense.input";
import {
    ArgsType,
    Field,
    InputType,
    OmitType,
    PartialType,
    PickType,
} from "@nestjs/graphql";
import { Expense } from "src/entities/expense";

@InputType()
export class UpdateExpenseInput extends PartialType(
    OmitType(CreateExpenseInput, ["userId"]),
) {}

@ArgsType()
export class UpdateExpenseArgs extends PickType(Expense, ["id"], ArgsType) {
    @Field(() => UpdateExpenseInput)
    data!: UpdateExpenseInput;
}
