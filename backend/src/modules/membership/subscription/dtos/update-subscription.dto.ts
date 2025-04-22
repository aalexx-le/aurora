import { ArgsType, Field, InputType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import {
    IsDate,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
} from "class-validator";
import { MembershipSubscriptionStatus } from "../../../../entities/prisma/membership-subscription-status.enum";

@InputType()
export class UpdateSubscriptionDto {
    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    planId?: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsEnum(MembershipSubscriptionStatus)
    status?: MembershipSubscriptionStatus;

    @Field(() => Date, { nullable: true })
    @IsOptional()
    @IsDate()
    endDate?: Date;
}

@ArgsType()
export class UpdateSubscriptionArgs {
    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    id: string;

    @Field(() => UpdateSubscriptionDto)
    @Type(() => UpdateSubscriptionDto)
    @ValidateNested()
    data: UpdateSubscriptionDto;
}
