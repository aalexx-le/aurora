import { ArgsType, Field, InputType, ObjectType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsString } from "class-validator";

@InputType()
export class GoogleAuthInputDto {
    @IsString()
    @Field(() => String)
    idToken!: string;
}

@ArgsType()
export class GoogleAuthArgs {
    @Field(() => GoogleAuthInputDto)
    @Type(() => GoogleAuthInputDto)
    data!: GoogleAuthInputDto;
}

@ObjectType()
export class GoogleAuthResponseDto {
    @Field()
    accessToken!: string;

    @Field()
    refreshToken!: string;
}
