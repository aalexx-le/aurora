import { ArgsType, Field, InputType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { FeatureType } from "src/entities/prisma/feature-type.enum";

@InputType()
export class CreateFeatureDto {
    @Field(() => FeatureType)
    type: FeatureType;
}

@ArgsType()
export class CreateFeatureArgs {
    @Field(() => CreateFeatureDto)
    @Type(() => CreateFeatureDto)
    @ValidateNested()
    data: CreateFeatureDto;
}
