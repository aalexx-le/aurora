import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class SuggestExpenseArgs {
    @Field(() => String, { nullable: false })
    bankTransactionId: string;
}
