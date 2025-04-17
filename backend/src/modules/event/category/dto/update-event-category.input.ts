import { ArgsType, Field, InputType, Int, PartialType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { CreateEventCategoryInput } from "./create-event-category.input";

@InputType()
export class UpdateEventCategoryInput extends PartialType(
    CreateEventCategoryInput,
) {}

@ArgsType()
export class UpdateEventCategoryArgs {
    @Field(() => Int)
    id: number;

    @Field(() => UpdateEventCategoryInput)
    @ValidateNested()
    @Type(() => UpdateEventCategoryInput)
    data: UpdateEventCategoryInput;
}
