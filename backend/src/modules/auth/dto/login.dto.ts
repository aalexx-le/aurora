import {
    ArgsType,
    Field,
    InputType,
    ObjectType,
    PickType,
} from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsEmail, MinLength, ValidateNested } from "class-validator";
import { User } from "src/entities/user";

@InputType()
export class LoginReqDto extends PickType(User, ["email", "password"]) {
    @IsEmail()
    @Field(() => String, { nullable: false })
    email!: string;

    @MinLength(8)
    @Field(() => String, { nullable: false })
    password!: string;
}

@ArgsType()
export class LoginArgs {
    @ValidateNested()
    @Field(() => LoginReqDto, { nullable: false })
    @Type(() => LoginReqDto)
    data!: LoginReqDto;
}

@ObjectType()
export class LoginResDto {
    @Field()
    accessToken: string;

    @Field()
    refreshToken: string;
}
