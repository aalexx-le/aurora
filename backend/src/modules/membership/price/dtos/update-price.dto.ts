import { ArgsType, Field, InputType, Int } from "@nestjs/graphql";
import { Type } from "class-transformer";
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from "class-validator";
import { PriceStatus } from "../../../../entities/prisma/price-status.enum";

@InputType()
export class UpdatePriceDto {
    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsNumber()
    billingCycleId?: number;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsNumber()
    trialPeriodId?: number;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsNumber()
    unitPriceId?: number;

    @Field(() => String, { nullable: true })
    @IsOptional()
    @IsEnum(PriceStatus)
    status?: PriceStatus;
}

@ArgsType()
export class UpdatePriceArgs {
    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    id: string;

    @Field(() => UpdatePriceDto)
    @Type(() => UpdatePriceDto)
    @ValidateNested()
    data: UpdatePriceDto;
}
