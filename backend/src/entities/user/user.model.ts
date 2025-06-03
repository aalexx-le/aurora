import { Field } from '@nestjs/graphql';
import { ObjectType } from '@nestjs/graphql';
import { Int } from '@nestjs/graphql';
import { OtpPurpose } from '../prisma/otp-purpose.enum';
import { BankManager } from '../bank-manager/bank-manager.model';
import { CryptoPortfolio } from '../crypto-portfolio/crypto-portfolio.model';
import { CreatePortfolioExecution } from '../create-portfolio-execution/create-portfolio-execution.model';
import { Expense } from '../expense/expense.model';
import { ExpenseCategory } from '../expense-category/expense-category.model';
import { Event } from '../event/event.model';
import { EventRecurrence } from '../event-recurrence/event-recurrence.model';
import { EventCategory } from '../event-category/event-category.model';
import { MembershipSubscription } from '../membership-subscription/membership-subscription.model';
import { PaymentMethod } from '../payment-method/payment-method.model';

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

    @Field(() => [CreatePortfolioExecution], {nullable:true})
    createPortfolioExecutions?: Array<CreatePortfolioExecution>;

    @Field(() => [Expense], {nullable:true})
    expenses?: Array<Expense>;

    @Field(() => [ExpenseCategory], {nullable:true})
    expenseCategories?: Array<ExpenseCategory>;

    @Field(() => [Event], {nullable:true})
    events?: Array<Event>;

    @Field(() => [EventRecurrence], {nullable:true})
    eventRecurrences?: Array<EventRecurrence>;

    @Field(() => [EventCategory], {nullable:true})
    eventCategories?: Array<EventCategory>;

    @Field(() => [MembershipSubscription], {nullable:true})
    memberships?: Array<MembershipSubscription>;

    @Field(() => [PaymentMethod], {nullable:true})
    paymentMethods?: Array<PaymentMethod>;
}
