import { Field, Float, ObjectType } from "@nestjs/graphql";
import { BankManager } from "../bank-manager/bank-manager.model";
import { BankTransaction } from "../bank-transaction/bank-transaction.model";

@ObjectType()
export class BankAccount {

    @Field(() => String, {nullable:false})
    id!: string;

    @Field(() => String, {nullable:false})
    name!: string;

    @Field(() => String, {nullable:false})
    bankManagerId!: string;

    @Field(() => String, {nullable:false})
    accountName!: string;

    @Field(() => String, {nullable:false})
    accountNumber!: string;

    @Field(() => Float, {nullable:false})
    balance!: number;

    @Field(() => Date, {nullable:false})
    createdAt!: Date;

    @Field(() => Date, {nullable:false})
    updatedAt!: Date;

    @Field(() => String, {nullable:false})
    fullName!: string;

    @Field(() => BankManager, {nullable:false})
    bankManager?: BankManager;

    @Field(() => [BankTransaction], {nullable:true})
    transactions?: Array<BankTransaction>;
}
