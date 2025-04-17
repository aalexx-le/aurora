import { ArgsType, Field, InputType, OmitType } from "@nestjs/graphql";
import { Event } from "src/entities/event";
import { CreateRecurrenceInput } from "./create-recurrence.input";

@InputType()
export class CreateEventInput extends OmitType(
    Event,
    [
        "id",
        "user",
        "userId",
        "category",
        "recurrence",
        "createdAt",
        "updatedAt",
    ] as const,
    InputType,
) {
    @Field(() => CreateRecurrenceInput, { nullable: true })
    recurrence?: CreateRecurrenceInput;
}

@ArgsType()
export class CreateEventArgs {
    @Field(() => CreateEventInput)
    data: CreateEventInput;
}
