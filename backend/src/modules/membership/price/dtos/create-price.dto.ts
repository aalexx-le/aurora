import { ArgsType, Field, InputType, Int } from "@nestjs/graphql";
import { CurrencyCode, Interval } from "@paddle/paddle-node-sdk";
import { PriceStatus } from "@prisma/client";
import { Type } from "class-transformer";
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from "class-validator";

@InputType()
export class TimePeriodInput {
    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    interval: Interval;

    @Field(() => Int)
    @IsNotEmpty()
    @IsNumber()
    frequency: number;
}

@InputType()
export class UnitPriceInput {
    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    amount: string;

    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    currencyCode: CurrencyCode;
}

@InputType()
export class CreatePriceDto {
    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    planId: string;

    @Field(() => TimePeriodInput, { nullable: true })
    @IsOptional()
    @ValidateNested()
    @Type(() => TimePeriodInput)
    billingCycle?: TimePeriodInput;

    @Field(() => TimePeriodInput, { nullable: true })
    @IsOptional()
    @ValidateNested()
    @Type(() => TimePeriodInput)
    trialPeriod?: TimePeriodInput;

    @Field(() => UnitPriceInput)
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => UnitPriceInput)
    unitPrice: UnitPriceInput;

    @Field(() => String, { defaultValue: "active" })
    @IsOptional()
    @IsEnum(PriceStatus)
    status?: PriceStatus;
}

@ArgsType()
export class CreatePriceArgs {
    @Field(() => CreatePriceDto)
    @Type(() => CreatePriceDto)
    @ValidateNested()
    data: CreatePriceDto;
}
