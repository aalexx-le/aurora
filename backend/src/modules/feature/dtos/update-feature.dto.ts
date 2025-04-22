import { ArgsType, Field, InputType, Int } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";
import { FeatureType } from "src/entities/prisma/feature-type.enum";

@InputType()
export class UpdateFeatureDto {
    @Field(() => FeatureType, { nullable: true })
    type?: FeatureType;
}

@ArgsType()
export class UpdateFeatureArgs {
    @Field(() => Int)
    @IsNotEmpty()
    id: number;

    @Field(() => UpdateFeatureDto)
    @Type(() => UpdateFeatureDto)
    @ValidateNested()
    data: UpdateFeatureDto;
}
