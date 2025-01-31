import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { OtpPurpose } from '../prisma/otp-purpose.enum';
import { BankManager } from '../bank-manager/bank-manager.model';
import { CryptoPortfolio } from '../crypto-portfolio/crypto-portfolio.model';
import { Expense } from '../expense/expense.model';
import { ExpenseCategory } from '../expense-category/expense-category.model';

@ObjectType()
export class User {

    @Field(() => Int, {nullable:false})
    id!: number;

    @Field(() => String, {nullable:false})
    email!: string;

    @Field(() => String, {nullable:true})
    name!: string | null;

    @Field(() => String, {nullable:false})
    password!: string;

    @Field(() => String, {nullable:true})
    otp!: string | null;

    @Field(() => OtpPurpose, {nullable:true})
    otpPurpose!: `${OtpPurpose}` | null;

    @Field(() => [BankManager], {nullable:true})
    bankManager?: Array<BankManager>;

    @Field(() => [CryptoPortfolio], {nullable:true})
    cryptoPortfolios?: Array<CryptoPortfolio>;

    @Field(() => [Expense], {nullable:true})
    expenses?: Array<Expense>;

    @Field(() => [ExpenseCategory], {nullable:true})
    expenseCategories?: Array<ExpenseCategory>;
}
