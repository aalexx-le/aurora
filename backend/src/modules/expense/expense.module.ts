import { Module } from "@nestjs/common";
import { ExpenseService } from "./expense.service";
import { ExpenseResolver } from "./expense.resolver";
import { ExpenseCategoryModule } from "../expense-category/expense-category.module";
import { ExpenseCategoryService } from "../expense-category/expense-category.service";
import { BankModule } from "../bank/bank.module";
import { BankTransactionService } from "../bank/transaction/transaction.service";

@Module({
    imports: [ExpenseCategoryModule, BankModule],
    providers: [
        ExpenseResolver,
        ExpenseService,
        ExpenseCategoryService,
        BankTransactionService,
    ],
})
export class ExpenseModule {}
