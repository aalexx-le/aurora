import { CreateBankManagerInput } from "./create-bank-manager.input";
import { Field, InputType, Int, PartialType } from "@nestjs/graphql";

@InputType()
export class UpdateBankInput extends PartialType(CreateBankManagerInput) {
    @Field(() => Int)
    id: number;
}
