import { ArgsType, Field, InputType, OmitType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { EventRecurrence } from "src/entities/event-recurrence";

@InputType()
export class CreateEventRecurrenceInput extends OmitType(
    EventRecurrence,
    ["id", "events", "user", "createdAt", "updatedAt"] as const,
    InputType,
) {}

@ArgsType()
export class CreateEventRecurrenceArgs {
    @Field(() => CreateEventRecurrenceInput)
    @ValidateNested()
    @Type(() => CreateEventRecurrenceInput)
    data: CreateEventRecurrenceInput;
}
