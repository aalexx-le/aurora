import { Module } from "@nestjs/common";
import { ExpenseService } from "./expense.service";
import { ExpenseResolver } from "./expense.resolver";
import { ExpenseCategoryService } from "./category/expense-category.service";
import { BankModule } from "../bank/bank.module";
import { BankTransactionService } from "../bank/transaction/transaction.service";
import { ExpenseCategoryResolver } from "./category/expense-category.resolver";
import { MonthlyTargetResolver } from "./monthly-target/monthly-target.resolver";
import { MonthlyTargetService } from "./monthly-target/monthly-target.service";

@Module({
    imports: [BankModule],
    providers: [
        ExpenseResolver,
        ExpenseCategoryResolver,
        MonthlyTargetResolver,

        ExpenseService,
        ExpenseCategoryService,
        MonthlyTargetService,

        BankTransactionService,
    ],
})
export class ExpenseModule {}
