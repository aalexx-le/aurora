import { ArgsType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@ArgsType()
export class DeleteDiscountArgs {
    @Field(() => String)
    @IsString()
    @IsNotEmpty()
    id: string;
}
