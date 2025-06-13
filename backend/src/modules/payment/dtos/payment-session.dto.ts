import { ArgsType, Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { Type } from "class-transformer";
import {
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested
} from "class-validator";

@InputType()
export class CreatePaymentSessionDto {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    planId: string;

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    priceId: string;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsString()
    discountId?: string;
}

@ArgsType()
export class CreatePaymentSessionArgs {
    @Field(() => CreatePaymentSessionDto)
    @Type(() => CreatePaymentSessionDto)
    @ValidateNested()
    data: CreatePaymentSessionDto;
}

@ObjectType()
export class PaymentSession {
    @Field(() => String)
    sessionId: string;

    @Field(() => Int)
    userId: number;

    @Field(() => String)
    planId: string;

    @Field(() => String)
    priceId: string;

    @Field(() => String, { nullable: true })
    discountId?: string;

    @Field(() => Number, { nullable: true })
    discountAmount?: number;

    @Field(() => Number)
    finalAmount: number;

    @Field(() => Date)
    expiresAt: Date;

    @Field(() => Date)
    createdAt: Date;
}

@InputType()
export class GetPaymentSessionDto {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    sessionId: string;
}

@ArgsType()
export class GetPaymentSessionArgs {
    @Field(() => GetPaymentSessionDto)
    @Type(() => GetPaymentSessionDto)
    @ValidateNested()
    data: GetPaymentSessionDto;
} 