import { Module } from "@nestjs/common";
import { ExpenseService } from "./expense.service";
import { ExpenseResolver } from "./expense.resolver";
import { ExpenseCategoryService } from "./category/expense-category.service";
import { BankModule } from "../bank/bank.module";
import { BankTransactionService } from "../bank/transaction/transaction.service";
import { ExpenseCategoryResolver } from "./category/expense-category.resolver";
import { MonthlyTargetResolver } from "./monthly-target/monthly-target.resolver";
import { MonthlyTargetService } from "./monthly-target/monthly-target.service";
import { HttpModule } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";

const AIServerHttpModule = HttpModule.registerAsync({
    useFactory: (configService: ConfigService) => {
        console.log(
            "AI_API_SERVER_URL",
            configService.get("AI_API_SERVER_URL"),
        );
        return {
            baseURL: configService.get("AI_API_SERVER_URL"),
        };
    },
    inject: [ConfigService],
});

@Module({
    imports: [BankModule, AIServerHttpModule],
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
