import { ArgsType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@ArgsType()
export class GetPriceArgs {
    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    id: string;
}
