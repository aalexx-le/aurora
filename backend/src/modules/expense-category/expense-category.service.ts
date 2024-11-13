import { Injectable } from "@nestjs/common";
import { CreateExpenseCategoryInput } from "./dto/create-expense-category.input";
import { UpdateExpenseCategoryInput } from "./dto/update-expense-category.input";
import { PrismaService } from "nestjs-prisma";
import {
    GetExpenseCategoryArgs,
    GetTotalAmountArgs,
} from "./dto/get-expense-category.input";

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

    findMany(args: GetExpenseCategoryArgs) {
        return this.prismaService.expenseCategory.findMany({
            where: {
                userId: args.userId,
            },
        });
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

    async totalAmount(categoryId: string, args: GetTotalAmountArgs) {
        const result = await this.prismaService.expense.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                categoryId,
                createdAt: {
                    gte: args.startDate,
                    lte: args.endDate,
                },
            },
        });
        return result._sum.amount || 0;
    }
}
