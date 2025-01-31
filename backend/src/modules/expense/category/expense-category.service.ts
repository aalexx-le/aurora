import { Injectable } from "@nestjs/common";
import { CreateExpenseCategoryInput } from "./dto/create-expense-category.input";
import { UpdateExpenseCategoryInput } from "./dto/update-expense-category.input";
import { PrismaService } from "nestjs-prisma";
import {
    GetExpenseCategoryArgs,
    GetTotalAmountArgs,
} from "./dto/get-expense-category.input";
import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { TotalSpentAmountOutput } from "./dto/total-spent-amount.output";

@Injectable()
export class ExpenseCategoryService {
    constructor(private readonly prismaService: PrismaService) {}

    create(data: CreateExpenseCategoryInput) {
        return this.prismaService.expenseCategory.create({
            data,
        });
    }

    findOne(id: string) {
        return this.prismaService.expenseCategory.findUnique({
            where: {
                id,
            },
        });
    }

    findMany(input: GetExpenseCategoryArgs) {
        const args: Prisma.ExpenseCategoryFindManyArgs<DefaultArgs> = {
            where: {
                userId: input.userId,
            },
        };

        if (input.name) {
            args.where.name = {
                contains: input.name,
            };
        }

        return this.prismaService.expenseCategory.findMany(args);
    }

    update(id: string, data: UpdateExpenseCategoryInput) {
        return this.prismaService.expenseCategory.update({
            where: { id },
            data,
        });
    }

    remove(id: string) {
        return this.prismaService.expenseCategory.delete({
            where: { id },
        });
    }

    countExpenses(categoryId: string) {
        return this.prismaService.expense.count({
            where: {
                categoryId,
            },
        });
    }

    async getTotalSpentAmounts(categoryId: string, args: GetTotalAmountArgs) {
        const expenses = await this.prismaService.expense.findMany({
            where: {
                categoryId,
                createdAt: {
                    gte: args.startDate,
                    lte: args.endDate,
                },
            },
        });

        // calculate total amount for each month each year
        const totalAmountsMap = new Map<string, TotalSpentAmountOutput>();

        expenses.forEach((expense) => {
            const date = new Date(expense.createdAt);
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const key = `${year}-${month}`;

            if (totalAmountsMap.has(key)) {
                totalAmountsMap.get(key)!.amount += expense.amount;
            } else {
                totalAmountsMap.set(key, {
                    year,
                    month,
                    amount: expense.amount,
                });
            }
        });

        return Array.from(totalAmountsMap.values());
    }
}
