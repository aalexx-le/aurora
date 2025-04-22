import { ArgsType, Field, InputType, Int } from "@nestjs/graphql";
import { Type } from "class-transformer";
import {
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from "class-validator";
import { MembershipSubscriptionStatus } from "../../../../entities/prisma/membership-subscription-status.enum";

@InputType()
export class CreateSubscriptionDto {
    @Field(() => Int)
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    planId: string;

    @Field(() => String)
    @IsNotEmpty()
    @IsEnum(MembershipSubscriptionStatus)
    status: MembershipSubscriptionStatus;

    @Field(() => Date, { nullable: true })
    @IsOptional()
    @IsDate()
    startDate?: Date;

    @Field(() => Date)
    @IsNotEmpty()
    @IsDate()
    endDate: Date;
}

@ArgsType()
export class CreateSubscriptionArgs {
    @Field(() => CreateSubscriptionDto)
    @Type(() => CreateSubscriptionDto)
    @ValidateNested()
    data: CreateSubscriptionDto;
}
