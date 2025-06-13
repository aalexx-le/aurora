import { ArgsType, Field, InputType, OmitType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { Feature } from "src/entities/feature/feature.model";
import { FeatureType } from "src/entities/prisma/feature-type.enum";

@InputType()
export class CreateFeatureDto extends OmitType(Feature, ["id", "membershipFeatures"], InputType) {}

@ArgsType()
export class CreateFeatureArgs {
    @Field(() => CreateFeatureDto)
    @Type(() => CreateFeatureDto)
    @ValidateNested()
    data: CreateFeatureDto;
}
