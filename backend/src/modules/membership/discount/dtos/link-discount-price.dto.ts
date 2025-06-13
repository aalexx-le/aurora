import { ArgsType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@ArgsType()
export class LinkDiscountToPriceArgs {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    discountId: string;

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    priceId: string;
}

@ArgsType()
export class UnlinkDiscountFromPriceArgs {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    discountId: string;

    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    priceId: string;
}
