import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { BankAccount } from "src/entities/bank-account";
import { BankTransaction } from "src/entities/bank-transaction";
import { BankTransactionService } from "../transaction/transaction.service";

@Resolver(() => BankAccount)
export class BankAccountResolver {
    constructor(
        private readonly bankTransactionService: BankTransactionService,
    ) {}

    @ResolveField("transactions", () => [BankTransaction])
    bankTransactions(@Parent() bankAccount: BankAccount) {
        return this.bankTransactionService.findManyByBankId(bankAccount.id);
    }
}
