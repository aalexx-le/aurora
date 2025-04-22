import { ArgsType, Field, InputType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
} from "class-validator";

@InputType()
export class UpdatePlanDto {
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    name?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    description?: string;
}

@ArgsType()
export class UpdatePlanArgs {
    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    id: string;

    @Field(() => UpdatePlanDto)
    @Type(() => UpdatePlanDto)
    @ValidateNested()
    data: UpdatePlanDto;
}
