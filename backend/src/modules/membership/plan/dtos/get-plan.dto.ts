import { ArgsType, Field } from "@nestjs/graphql";
import { IsNotEmpty, IsString } from "class-validator";

@ArgsType()
export class GetPlanArgs {
    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    id: string;
}
