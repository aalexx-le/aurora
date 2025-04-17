import {
    Args,
    Int,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from "@nestjs/graphql";
import { BankAccount } from "src/entities/bank-account";
import { BankTransaction } from "src/entities/bank-transaction";
import { BankAccountService } from "../account/account.service";
import { CreateBankTransactionArgs } from "./dto/create-bank-transaction.input";
import { BankTransactionService } from "./transaction.service";
import { UseGuards } from "@nestjs/common";
import { JwtGuard } from "../../auth/guards/jwt.guard";
import { AuthUser } from "../../../shared/decorators/auth-user.decorator";
import { User } from "../../../entities/user";

@UseGuards(JwtGuard)
@Resolver(() => BankTransaction)
export class BankTransactionResolver {
    constructor(
        private readonly bankTransactionService: BankTransactionService,
        private readonly bankAccountService: BankAccountService,
    ) {}

    @Query(() => [BankTransaction], { name: "getBankTransactions" })
    getBankTransactions(@AuthUser() user: User) {
        return this.bankTransactionService.findManyByUserId(user.id);
    }

    @ResolveField("bank", () => BankAccount)
    bank(@Parent() bankTransaction: BankTransaction) {
        return this.bankAccountService.getBankAccount(bankTransaction.bankId);
    }

    @Mutation(() => BankTransaction, { name: "createBankTransaction" })
    createOne(@Args() args: CreateBankTransactionArgs) {
        return this.bankTransactionService.create(args.data);
    }

    @Mutation(() => BankTransaction, { name: "removeBankTransaction" })
    async removeTransaction(@Args("id", { type: () => Int }) id: number) {
        return this.bankTransactionService.remove(id);
    }
}
