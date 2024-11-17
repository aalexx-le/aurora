import {
    ArgsType,
    Field,
    InputType,
    OmitType,
    PartialType,
    PickType,
} from "@nestjs/graphql";
import { CreateMonthlyTargetInput } from "./create-monthly-target.input";
import { MonthlyTarget } from "src/entities/monthly-target";

@InputType()
export class UpdateMonthlyTargetInput extends PartialType(
    OmitType(CreateMonthlyTargetInput, ["categoryId"] as const),
) {}

@ArgsType()
export class UpdateMonthlyTargetArgs extends PickType(
    MonthlyTarget,
    ["id"],
    ArgsType,
) {
    @Field(() => UpdateMonthlyTargetInput)
    data!: UpdateMonthlyTargetInput;
}
