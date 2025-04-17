import { ArgsType, Field, InputType, OmitType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { EventCategory } from "src/entities/event-category";

@InputType()
export class CreateEventCategoryInput extends OmitType(
    EventCategory,
    ["id", "events", "user", "userId"] as const,
    InputType,
) {}

@ArgsType()
export class CreateEventCategoryArgs {
    @Field(() => CreateEventCategoryInput)
    @ValidateNested()
    @Type(() => CreateEventCategoryInput)
    data: CreateEventCategoryInput;
}
