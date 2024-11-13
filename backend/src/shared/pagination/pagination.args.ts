import { ArgsType, Field, InputType, Int } from "@nestjs/graphql";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

@InputType()
export class PaginationInput {
    @Field(() => Int, { nullable: false })
    take?: number;

    @Field(() => String, { nullable: true })
    after?: string;

    @Field(() => String, { nullable: true })
    before?: string;
}

@ArgsType()
export class PaginationArgs {
    @ValidateNested()
    @Field(() => PaginationInput, { nullable: false })
    @Type(() => PaginationInput)
    pagination!: PaginationInput;
}
