import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class GetEventArgs {
    @Field(() => Date, { nullable: true })
    startDate?: Date;

    @Field(() => Date, { nullable: true })
    endDate?: Date;
}
