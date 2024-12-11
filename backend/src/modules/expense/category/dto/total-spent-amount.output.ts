import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class TotalSpentAmountOutput {
    @Field(() => Number, { nullable: false })
    amount: number;

    @Field(() => Number, { nullable: false })
    month: number;

    @Field(() => Number, { nullable: false })
    year: number;
}
