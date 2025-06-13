import {
    ArgsType,
    Field,
    InputType,
    ObjectType,
    registerEnumType,
} from "@nestjs/graphql";
import { Type } from "class-transformer";
import {
    IsDecimal,
    IsNotEmpty,
    IsOptional,
    IsString,
    ValidateNested,
} from "class-validator";
import { MembershipDiscount } from "src/entities/membership-discount";

// Validation error codes enum
export enum DiscountErrorCode {
    DISCOUNT_NOT_FOUND = "DISCOUNT_NOT_FOUND",
    DISCOUNT_INACTIVE = "DISCOUNT_INACTIVE",
    DISCOUNT_EXPIRED = "DISCOUNT_EXPIRED",
    DISCOUNT_EXHAUSTED = "DISCOUNT_EXHAUSTED",
    USER_LIMIT_EXCEEDED = "USER_LIMIT_EXCEEDED",
    USAGE_LIMIT_REACHED = "USAGE_LIMIT_REACHED",
    USER_USAGE_LIMIT_REACHED = "USER_USAGE_LIMIT_REACHED",
    DISCOUNT_NOT_APPLICABLE = "DISCOUNT_NOT_APPLICABLE",
    VALIDATION_ERROR = "VALIDATION_ERROR",
    INVALID_CURRENCY = "INVALID_CURRENCY",
    ALREADY_APPLIED = "ALREADY_APPLIED",
}

registerEnumType(DiscountErrorCode, {
    name: "DiscountErrorCode",
});

@InputType()
export class ValidateDiscountDto {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    code: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    priceId?: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    ipAddress?: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    userAgent?: string;
}

@ArgsType()
export class ValidateDiscountArgs {
    @Field(() => ValidateDiscountDto)
    @Type(() => ValidateDiscountDto)
    @ValidateNested()
    data: ValidateDiscountDto;
}

@ObjectType()
export class DiscountValidationResult {
    @Field(() => Boolean)
    isValid: boolean;

    @Field(() => MembershipDiscount, { nullable: true })
    discount?: MembershipDiscount;

    @Field(() => String, { nullable: true })
    originalAmount?: string;

    @Field(() => String, { nullable: true })
    discountAmount?: string;

    @Field(() => String, { nullable: true })
    finalAmount?: string;

    @Field(() => DiscountErrorCode, { nullable: true })
    errorCode?: DiscountErrorCode;
}
