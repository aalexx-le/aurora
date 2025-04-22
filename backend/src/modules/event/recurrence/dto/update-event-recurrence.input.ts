import { ArgsType, Field, InputType, Int, PartialType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { CreateEventRecurrenceInput } from "./create-event-recurrence.input";

@InputType()
export class UpdateEventRecurrenceInput extends PartialType(
    CreateEventRecurrenceInput,
) {}

@ArgsType()
export class UpdateEventRecurrenceArgs {
    @Field(() => Int)
    id: number;

    @Field(() => UpdateEventRecurrenceInput)
    @ValidateNested()
    @Type(() => UpdateEventRecurrenceInput)
    data: UpdateEventRecurrenceInput;
}
