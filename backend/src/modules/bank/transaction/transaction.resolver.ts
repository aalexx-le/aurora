import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { BankAccount } from "../../../entities/bank-account";
import { BankTransaction } from "../../../entities/bank-transaction";
import { BankTransactionService } from "./transaction.service";
import { BankAccountService } from "../account/account.service";

@Resolver(() => BankTransaction)
export class BankTransactionResolver {
    constructor(
        private readonly bankTransactionService: BankTransactionService,
        private readonly bankAccountService: BankAccountService,
    ) {}

    @Query(() => [BankTransaction], { name: "getBankTransactions" })
    getBankTransactions(
        @Args("userId", { type: () => Number }) userId: number,
    ) {
        return this.bankTransactionService.findManyByUserId(userId);
    }

    @ResolveField("bank", () => BankAccount)
    bank(@Parent() bankTransaction: BankTransaction) {
        return this.bankAccountService.getBankAccount(bankTransaction.bankId);
    }
}
