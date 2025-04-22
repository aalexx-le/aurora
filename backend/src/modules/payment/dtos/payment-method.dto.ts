import { ArgsType, Field, InputType, Int } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";

@InputType()
export class GetPaymentMethodDto {
    @Field(() => Int, { nullable: true })
    id?: number;
}

@ArgsType()
export class GetPaymentMethodArgs {
    @Field(() => GetPaymentMethodDto)
    @Type(() => GetPaymentMethodDto)
    @ValidateNested()
    data: GetPaymentMethodDto;
}
