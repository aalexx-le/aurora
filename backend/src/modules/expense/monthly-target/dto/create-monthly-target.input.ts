import { ArgsType, Field, InputType, OmitType } from "@nestjs/graphql";
import { MonthlyTarget } from "src/entities/monthly-target";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

@InputType()
export class CreateMonthlyTargetInput extends OmitType(
    MonthlyTarget,
    ["id", "category"] as const,
    InputType,
) {}

@ArgsType()
export class CreateMonthlyTargetArgs {
    @Field(() => CreateMonthlyTargetInput)
    @ValidateNested()
    @Type(() => CreateMonthlyTargetInput)
    data: CreateMonthlyTargetInput;
}
