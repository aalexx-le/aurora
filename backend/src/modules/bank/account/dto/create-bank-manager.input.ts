import { ArgsType, Field, InputType, Int } from "@nestjs/graphql";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

@InputType()
export class CreateBankManagerInput {
    @Field({ nullable: false })
    name: string;

    @Field(() => Int, { nullable: false })
    userId: number;

    @Field({ nullable: false })
    apiKey: string;
}

@ArgsType()
export class CreateBankManagerArgs {
    @Field(() => CreateBankManagerInput)
    @ValidateNested()
    @Type(() => CreateBankManagerInput)
    data: CreateBankManagerInput;
}
