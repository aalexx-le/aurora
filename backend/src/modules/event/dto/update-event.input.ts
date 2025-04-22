import {
    ArgsType,
    Field,
    InputType,
    Int,
    OmitType,
    PartialType,
} from "@nestjs/graphql";
import { CreateEventInput } from "./create-event.input";
import { CreateRecurrenceInput } from "./create-recurrence.input";

@InputType()
export class UpdateEventInput extends PartialType(
    OmitType(CreateEventInput, ["recurrence"]),
) {}

@ArgsType()
export class UpdateEventArgs {
    @Field(() => Int)
    id: number;

    @Field(() => UpdateEventInput)
    data: UpdateEventInput;
}
