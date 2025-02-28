import { Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { BankAccount } from "src/entities/bank-account";
import { BankTransaction } from "src/entities/bank-transaction";
import { BankTransactionService } from "../transaction/transaction.service";
import { HistoricalBankBalance } from "../../../entities/historical-bank-balance";
import { Args, Mutation } from "@nestjs/graphql";
import { CreateBankAccountArgs } from "./dto/create-bank-account.input";
import { BankAccountService } from "./account.service";
import { UseGuards } from "@nestjs/common";
import { JwtGuard } from "../../auth/guards/jwt.guard";
import { AuthUser } from "../../../shared/decorators/auth-user.decorator";
import { User } from "../../../entities/user";

@UseGuards(JwtGuard)
@Resolver(() => BankAccount)
export class BankAccountResolver {
    constructor(
        private readonly bankTransactionService: BankTransactionService,
        private readonly bankAccountService: BankAccountService,
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

    @Query(() => [BankAccount], { name: "getBankAccounts" })
    getBankAccounts(@AuthUser() user: User) {
        return this.bankAccountService.getBankAccounts(user.id);
    }

    @Mutation(() => BankAccount, { name: "createBankAccount" })
    createBankAccount(@Args() args: CreateBankAccountArgs) {
        return this.bankAccountService.createBankAccount(args.data);
    }
}
