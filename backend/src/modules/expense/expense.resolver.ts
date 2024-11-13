import {
    Args,
    Int,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from "@nestjs/graphql";
import { ExpenseService } from "./expense.service";
import { CreateExpenseArgs } from "./dto/create-expense.input";
import { UpdateExpenseArgs } from "./dto/update-expense.input";
import { Expense } from "src/entities/expense";
import { ExpenseCategory } from "src/entities/expense-category";
import { ExpenseCategoryService } from "../expense-category/expense-category.service";
import { BankTransaction } from "../../entities/bank-transaction";
import { BankTransactionService } from "../bank/transaction/transaction.service";
import { GetExpenseArgs } from "./dto/get-expense.input";

@Resolver(() => Expense)
export class ExpenseResolver {
    constructor(
        private readonly expenseService: ExpenseService,
        private readonly expenseCategoryService: ExpenseCategoryService,
        private readonly bankTransactionService: BankTransactionService,
    ) {}

    @Query(() => [Expense], { name: "getExpenses" })
    findMany(@Args() args: GetExpenseArgs) {
        return this.expenseService.findMany(args);
    }

    @ResolveField("category", () => ExpenseCategory)
    category(@Parent() expense: Expense) {
        return this.expenseCategoryService.findOne(expense.categoryId);
    }

    @ResolveField("transaction", () => BankTransaction)
    transaction(@Parent() expense: Expense) {
        return this.bankTransactionService.findOne(expense.bankTransactionId);
    }

    @Mutation(() => Expense, { name: "createExpense" })
    createOne(@Args() args: CreateExpenseArgs) {
        return this.expenseService.create(args.data);
    }

    @Mutation(() => Expense, { name: "updateExpense" })
    updateOne(@Args() args: UpdateExpenseArgs) {
        return this.expenseService.update(args.id, args.data);
    }

    @Mutation(() => Expense, { name: "removeExpense" })
    removeOne(@Args("id", { type: () => String }) id: string) {
        return this.expenseService.remove(id);
    }

    @Mutation(() => Int, { name: "removeExpenses" })
    removeMany(@Args("ids", { type: () => [String] }) ids: string[]) {
        return this.expenseService.removeMany(ids);
    }
}
