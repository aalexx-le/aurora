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
import { MonthlyTarget } from "src/entities/monthly-target";
import { GetMonthlyTargetArgs } from "../monthly-target/dto/get-monthly-target.input";
import { MonthlyTargetService } from "../monthly-target/monthly-target.service";

@Resolver(() => ExpenseCategory)
export class ExpenseCategoryResolver {
    constructor(
        private readonly expenseCategoryService: ExpenseCategoryService,
        private readonly monthlyTargetService: MonthlyTargetService,
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

    @ResolveField("monthlyTargets", () => [MonthlyTarget])
    monthlyTargets(
        @Parent() category: ExpenseCategory,
        @Args() args: GetMonthlyTargetArgs,
    ) {
        return this.monthlyTargetService.findMany(category.id, args);
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
