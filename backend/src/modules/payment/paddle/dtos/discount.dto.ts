import {
    ArgsType,
    Field,
    ID,
    InputType,
    Int,
    PartialType,
} from "@nestjs/graphql";
import {
    CurrencyCode,
    DiscountType as PaddleDiscountType,
} from "@paddle/paddle-node-sdk";
import { Type } from "class-transformer";
import {
    IsArray,
    IsBoolean,
    IsDateString,
    IsNotEmpty,
    IsOptional,
    IsPositive,
    IsString,
    ValidateNested,
} from "class-validator";

// Interface that matches Paddle SDK CreateDiscountRequestBody
export interface PaddleDiscountData {
    description: string;
    type: PaddleDiscountType;
    amount: string;
    currency_code?: CurrencyCode;
    enabled_for_checkout?: boolean;
    code?: string;
    recur?: boolean;
    maximum_recurring_intervals?: number;
    usage_limit?: number;
    restrict_to?: string[];
    expires_at?: string;
}

@InputType()
export class CreateDiscountInputData {
    @Field()
    @IsNotEmpty()
    @IsString()
    description: string;

    @Field(() => String)
    @IsNotEmpty()
    type: PaddleDiscountType;

    @Field()
    @IsNotEmpty()
    @IsString()
    amount: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    currencyCode?: CurrencyCode;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    enabledForCheckout?: boolean;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    code?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    recur?: boolean;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsPositive()
    maximumRecurringIntervals?: number;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsPositive()
    usageLimit?: number;

    @Field(() => [String], { nullable: true })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    restrictTo?: string[];

    @Field({ nullable: true })
    @IsOptional()
    @IsDateString()
    expiresAt?: string;
}

@ArgsType()
export class CreateDiscountArgs {
    @Field(() => CreateDiscountInputData)
    @ValidateNested()
    @Type(() => CreateDiscountInputData)
    data: CreateDiscountInputData;
}

@InputType()
export class UpdateDiscountInputData extends PartialType(
    CreateDiscountInputData,
) {}

@ArgsType()
export class UpdateDiscountArgs {
    @Field(() => ID)
    @IsNotEmpty()
    @IsString()
    id: string;

    @Field(() => UpdateDiscountInputData)
    @ValidateNested()
    @Type(() => UpdateDiscountInputData)
    data: UpdateDiscountInputData;
}
 