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
export class UpdateDiscountDto {
    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    name?: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    description?: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    code?: string;

    // Discount Configuration
    @Field(() => DiscountType, { nullable: true })
    @IsEnum(DiscountType)
    @IsOptional()
    type?: DiscountType;

    @Field(() => String, { nullable: true })
    @IsDecimal()
    @IsOptional()
    value?: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    currencyCode?: string;

    @Field(() => String, { nullable: true })
    @IsDecimal()
    @IsOptional()
    maxAmount?: string;

    // Validity and Constraints
    @Field(() => Boolean, { nullable: true })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

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
    @IsOptional()
    maxUsesPerUser?: number;

    // Targeting Rules
    @Field(() => DiscountTargetType, { nullable: true })
    @IsEnum(DiscountTargetType)
    @IsOptional()
    targetType?: DiscountTargetType;
}

@ArgsType()
export class UpdateDiscountArgs {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    id: string;

    @Field(() => UpdateDiscountDto)
    @Type(() => UpdateDiscountDto)
    @ValidateNested()
    data: UpdateDiscountDto;
}
