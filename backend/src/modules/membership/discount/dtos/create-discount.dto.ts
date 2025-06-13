import { ArgsType, Field, InputType, Int } from "@nestjs/graphql";
import { Type } from "class-transformer";
import {
    IsBoolean,
    IsDateString,
    IsDecimal,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
} from "class-validator";
import { DiscountTargetType } from "src/entities/prisma/discount-target-type.enum";
import { DiscountType } from "src/entities/prisma/discount-type.enum";

@InputType()
export class CreateDiscountDto {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    name: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    description?: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    code?: string;

    // Discount Configuration
    @Field(() => DiscountType)
    @IsEnum(DiscountType)
    type: DiscountType;

    @Field(() => String)
    @IsDecimal()
    @IsNotEmpty()
    value: string; // Using string for Decimal compatibility

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    currencyCode?: string;

    @Field(() => String, { nullable: true })
    @IsDecimal()
    @IsOptional()
    maxAmount?: string;

    // Validity and Constraints
    @Field(() => Boolean, { defaultValue: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean = true;

    @Field(() => String, { nullable: true })
    @IsDateString()
    @IsOptional()
    startDate?: string;

    @Field(() => String, { nullable: true })
    @IsDateString()
    @IsOptional()
    endDate?: string;

    @Field(() => Int, { nullable: true })
    @IsInt()
    @IsOptional()
    maxUses?: number;

    @Field(() => Int, { nullable: true })
    @IsInt()
    maxUsesPerUser?: number;

    @Field(() => Boolean, { defaultValue: false })
    @IsBoolean()
    @IsOptional()
    isRecurring?: boolean = false;

    // Targeting Rules
    @Field(() => DiscountTargetType, {
        defaultValue: DiscountTargetType.FIRST_TIME_USER,
    })
    @IsEnum(DiscountTargetType)
    @IsOptional()
    targetType?: DiscountTargetType = DiscountTargetType.FIRST_TIME_USER;
}

@ArgsType()
export class CreateDiscountArgs {
    @Field(() => CreateDiscountDto)
    @Type(() => CreateDiscountDto)
    @ValidateNested()
    data: CreateDiscountDto;
}
