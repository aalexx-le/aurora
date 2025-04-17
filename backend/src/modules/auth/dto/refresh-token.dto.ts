import { ArgsType, Field, InputType, ObjectType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsString } from "class-validator";

@InputType()
export class RefreshTokenInputDto {
    @IsString()
    @Field(() => String)
    refreshToken!: string;
}

@ArgsType()
export class RefreshTokenArgs {
    @Field(() => RefreshTokenInputDto)
    @Type(() => RefreshTokenInputDto)
    data!: RefreshTokenInputDto;
}

@ObjectType()
export class RefreshTokenResponseDto {
    @Field()
    accessToken!: string;

    @Field()
    refreshToken!: string;

    @Field()
    expiresIn!: number;
}
