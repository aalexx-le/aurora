import {
    Args,
    Int,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from "@nestjs/graphql";
import { ExpenseCategoryService } from "./expense-category.service";
import { CreateExpenseCategoryArgs } from "./dto/create-expense-category.input";
import { UpdateExpenseCategoryArgs } from "./dto/update-expense-category.input";
import { ExpenseCategory } from "src/entities/expense-category";
import {
    GetExpenseCategoryArgs,
    GetTotalAmountArgs,
} from "./dto/get-expense-category.input";

@Resolver(() => ExpenseCategory)
export class ExpenseCategoryResolver {
    constructor(
        private readonly expenseCategoryService: ExpenseCategoryService,
    ) {}
    @Query(() => [ExpenseCategory], { name: "getExpenseCategories" })
    findMany(@Args() args: GetExpenseCategoryArgs) {
        return this.expenseCategoryService.findMany(args);
    }

    @ResolveField("countExpenses", () => Int)
    countExpenses(@Parent() category: ExpenseCategory) {
        return this.expenseCategoryService.countExpenses(category.id);
    }

    @ResolveField("totalAmount", () => Int)
    totalAmount(
        @Args() args: GetTotalAmountArgs,
        @Parent() category: ExpenseCategory,
    ) {
        return this.expenseCategoryService.totalAmount(category.id, args);
    }

    @Mutation(() => ExpenseCategory, { name: "createExpenseCategory" })
    createOne(
        @Args()
        args: CreateExpenseCategoryArgs,
    ) {
        return this.expenseCategoryService.create(args.data);
    }

    @Mutation(() => ExpenseCategory, { name: "updateExpenseCategory" })
    updateOne(
        @Args()
        args: UpdateExpenseCategoryArgs,
    ) {
        return this.expenseCategoryService.update(args.id, args.data);
    }

    @Mutation(() => ExpenseCategory, { name: "removeExpenseCategory" })
    removeOne(@Args("id", { type: () => String }) id: string) {
        return this.expenseCategoryService.remove(id);
    }
}
