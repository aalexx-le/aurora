import {
    ArgsType,
    Field,
    ID,
    InputType,
    Int,
    OmitType,
    PartialType,
} from "@nestjs/graphql";
import {
    CurrencyCode,
    Interval,
    Status as PriceStatus,
    TaxMode,
} from "@paddle/paddle-node-sdk";
import { Type } from "class-transformer";
import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsPositive,
    IsString,
    Max,
    Min,
    ValidateNested,
} from "class-validator";

@InputType()
class BillingCycleInput {
    @Field(() => String)
    @IsNotEmpty()
    interval: Interval;

    @Field(() => Int)
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    frequency: number;
}

@InputType()
class TrialPeriodInput {
    @Field(() => String)
    @IsNotEmpty()
    interval: Interval;

    @Field(() => Int)
    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    frequency: number;
}

@InputType()
class PriceQuantityInput {
    @Field(() => Int)
    @IsInt()
    @Min(1)
    @IsNotEmpty()
    minimum: number;

    @Field(() => Int)
    @IsInt()
    @Max(100000) // Example Max, adjust as needed
    @IsNotEmpty()
    maximum: number;
}

@InputType()
class UnitPriceInput {
    @Field()
    @IsString()
    @IsNotEmpty()
    amount: string; // Paddle uses string for amounts

    @Field(() => String)
    @IsNotEmpty()
    currencyCode: CurrencyCode;
}

@InputType()
export class CreatePriceInputData {
    @Field()
    @IsNotEmpty()
    @IsString()
    description: string;

    @Field(() => ID)
    @IsNotEmpty()
    @IsString()
    productId: string;

    @Field(() => BillingCycleInput, { nullable: true })
    @IsOptional()
    @ValidateNested()
    @Type(() => BillingCycleInput)
    billingCycle?: BillingCycleInput;

    @Field(() => TrialPeriodInput, { nullable: true })
    @IsOptional()
    @ValidateNested()
    @Type(() => TrialPeriodInput)
    trialPeriod?: TrialPeriodInput;

    @Field(() => PriceQuantityInput)
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => PriceQuantityInput)
    quantity: PriceQuantityInput;

    @Field(() => UnitPriceInput)
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => UnitPriceInput)
    unitPrice: UnitPriceInput;

    @Field(() => String)
    @IsNotEmpty()
    taxMode: TaxMode;

    // custom_data?: CustomData; // Handle if needed
    // unit_price_overrides?: UnitPriceOverrideInput[]; // Handle if needed
}

@ArgsType()
export class CreatePriceArgs {
    @Field(() => CreatePriceInputData)
    @ValidateNested()
    @Type(() => CreatePriceInputData)
    data: CreatePriceInputData;
}

@InputType()
export class UpdatePriceInputData extends PartialType(
    OmitType(CreatePriceInputData, ["productId"]),
) {
    @Field(() => String, { nullable: true })
    @IsOptional()
    status?: PriceStatus;

    // @Field(() => BillingCycleInput, { nullable: true })
    // @IsOptional()
    // @ValidateNested()
    // @Type(() => BillingCycleInput)
    // billingCycle?: BillingCycleInput;

    // @Field(() => TrialPeriodInput, { nullable: true })
    // @IsOptional()
    // @ValidateNested()
    // @Type(() => TrialPeriodInput)
    // trialPeriod?: TrialPeriodInput;

    // @Field(() => PriceQuantityInput, { nullable: true })
    // @IsOptional()
    // @ValidateNested()
    // @Type(() => PriceQuantityInput)
    // quantity?: PriceQuantityInput;

    // @Field(() => UnitPriceInput, { nullable: true })
    // @IsOptional()
    // @ValidateNested()
    // @Type(() => UnitPriceInput)
    // unitPrice?: UnitPriceInput;

    // @Field(() => String, { nullable: true })
    // @IsOptional()
    // taxMode?: TaxMode;
}

@ArgsType()
export class UpdatePriceArgs {
    @Field(() => ID)
    @IsNotEmpty()
    @IsString()
    id: string;

    @Field(() => UpdatePriceInputData)
    @ValidateNested()
    @Type(() => UpdatePriceInputData)
    data: UpdatePriceInputData;
}
