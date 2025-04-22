import { ArgsType, Field, InputType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from "class-validator";

@InputType()
export class CreatePlanDto {
    @Field()
    @IsNotEmpty()
    @IsString()
    name: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    description?: string;

    @Field(() => [Number], { nullable: true })
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    featureIds?: number[];
}

@ArgsType()
export class CreatePlanArgs {
    @Field(() => CreatePlanDto)
    @Type(() => CreatePlanDto)
    @ValidateNested()
    data: CreatePlanDto;
}
