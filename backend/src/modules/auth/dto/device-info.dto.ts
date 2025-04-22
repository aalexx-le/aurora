import { ArgsType, Field, InputType, ObjectType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from "class-validator";

@InputType()
export class DeviceInfoDto {
    @Field(() => String)
    @IsString()
    deviceId: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    deviceName?: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    deviceType?: string;
}

@ArgsType()
export class DeviceInfoArgs {
    @Field(() => DeviceInfoDto)
    @Type(() => DeviceInfoDto)
    @ValidateNested()
    data: DeviceInfoDto;
}

@ObjectType()
export class UserDeviceDto {
    @Field(() => String)
    deviceId: string;

    @Field(() => String, { nullable: true })
    deviceName?: string;

    @Field(() => String, { nullable: true })
    deviceType?: string;

    @Field(() => Date)
    lastLoginAt: Date;

    @Field(() => String, { nullable: true })
    lastLoginIp?: string;

    @Field(() => Boolean)
    isActive: boolean;
}
