import { ArgsType, Field, Int } from "@nestjs/graphql";

@ArgsType()
export class GetExpenseCategoryArgs {
    @Field(() => Int)
    userId: number;
}

@ArgsType()
export class GetTotalAmountArgs {
    @Field(() => Date, { nullable: true })
    startDate?: Date;

    @Field(() => Date, { nullable: true })
    endDate?: Date;
}
