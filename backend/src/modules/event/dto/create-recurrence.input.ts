import { InputType, OmitType } from "@nestjs/graphql";
import { Recurrence } from "src/entities/recurrence";

@InputType()
export class CreateRecurrenceInput extends OmitType(
    Recurrence,
    ["id", "event", "eventId", "createdAt", "updatedAt"] as const,
    InputType,
) {}
