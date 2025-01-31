import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { BankAccount } from "src/entities/bank-account";
import { BankTransaction } from "src/entities/bank-transaction";
import { BankTransactionService } from "../transaction/transaction.service";
import { HistoricalBankBalance } from "../../../entities/historical-bank-balance";

@Resolver(() => BankAccount)
export class BankAccountResolver {
    constructor(
        private readonly bankTransactionService: BankTransactionService,
    ) {}

    @ResolveField("transactions", () => [BankTransaction])
    bankTransactions(@Parent() bankAccount: BankAccount) {
        return this.bankTransactionService.findManyByBankId(bankAccount.id);
    }

    @ResolveField("historicalBalances", () => [HistoricalBankBalance])
    historicalBalances(@Parent() bankAccount: BankAccount) {
        return this.bankTransactionService.findHistoricalBalances(
            bankAccount.id,
        );
    }
}
