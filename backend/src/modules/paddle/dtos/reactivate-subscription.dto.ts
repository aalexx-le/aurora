import { ArgsType, Field } from "@nestjs/graphql";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export enum PastDueAction {
    RETRY = "retry",
    IGNORE = "ignore",
}

@ArgsType()
export class PaddleReactivateSubscriptionDto {
    @Field(() => String)
    @IsNotEmpty()
    @IsString()
    id: string;

    @Field(() => String, {
        nullable: true,
        description: "How to handle failed transactions (retry or ignore)",
    })
    @IsOptional()
    @IsEnum(PastDueAction)
    handlePastDueTransactions?: PastDueAction;
}
