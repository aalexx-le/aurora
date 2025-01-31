import { ArgsType, Field, Int } from "@nestjs/graphql";

@ArgsType()
export class GetExpenseArgs {
    @Field(() => Date, { nullable: true })
    startDate?: Date;

    @Field(() => Date, { nullable: true })
    endDate?: Date;
}
