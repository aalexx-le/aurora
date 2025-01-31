import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateExpenseInput } from "./dto/create-expense.input";
import { UpdateExpenseInput } from "./dto/update-expense.input";
import { PrismaService } from "nestjs-prisma";
import { BankTransactionService } from "../bank/transaction/transaction.service";
import { GetExpenseArgs } from "./dto/get-expense.input";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { Expense } from "../../entities/expense";

@Injectable()
export class ExpenseService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly bankTransactionService: BankTransactionService,
        private readonly httpService: HttpService,
    ) {}

    async create(data: CreateExpenseInput) {
        const transaction = await this.bankTransactionService.findOne(
            data.bankTransactionId,
        );
        const amountSign = Math.sign(data.amount);
        const remainAmount =
            Math.abs(transaction.spentAmount) - Math.abs(data.amount);
        if (remainAmount < 0) {
            throw new BadRequestException(
                "Amount exceeds the transaction spent",
            );
        }

        return this.prismaService.$transaction(async (txn) => {
            await txn.bankTransaction.update({
                where: {
                    id: data.bankTransactionId,
                },
                data: {
                    spentAmount: remainAmount * amountSign,
                },
            });

            return txn.expense.create({
                data,
            });
        });
    }

    findMany(userId: number, args: GetExpenseArgs) {
        return this.prismaService.expense.findMany({
            where: {
                userId,
                createdAt: {
                    gte: args.startDate,
                    lte: args.endDate,
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async update(id: string, data: UpdateExpenseInput) {
        const transaction = await this.bankTransactionService.findOne(
            data.bankTransactionId,
        );
        const previousExpense = await this.prismaService.expense.findUnique({
            where: { id },
        });
        const previousTransaction = await this.bankTransactionService.findOne(
            previousExpense.bankTransactionId,
        );

        return this.prismaService.$transaction(async (txn) => {
            const isDifferentTransaction =
                data.bankTransactionId !== previousExpense.bankTransactionId;

            const amountSign = Math.sign(data.amount);
            let remainAmount = Math.abs(transaction.spentAmount);

            const prevAmountSign = Math.sign(previousExpense.amount);
            let prevRemainAmount = Math.abs(previousTransaction.spentAmount);

            if (isDifferentTransaction) {
                prevRemainAmount += Math.abs(previousExpense.amount);
            } else {
                // if the transaction is the same
                remainAmount += Math.abs(previousExpense.amount);
            }

            remainAmount -= Math.abs(data.amount);
            if (remainAmount < 0) {
                throw new BadRequestException(
                    "Amount exceeds the transaction spent",
                );
            }

            if (isDifferentTransaction) {
                await txn.bankTransaction.update({
                    where: {
                        id: previousTransaction.id,
                    },
                    data: {
                        spentAmount: prevRemainAmount * prevAmountSign,
                    },
                });
            }
            await txn.bankTransaction.update({
                where: {
                    id: data.bankTransactionId,
                },
                data: {
                    spentAmount: remainAmount * amountSign,
                },
            });

            return txn.expense.update({
                where: { id },
                data,
            });
        });
    }

    async remove(id: string) {
        return this.prismaService.$transaction(async (txn) => {
            const expense = await txn.expense.delete({
                where: { id },
            });

            const transaction = await this.bankTransactionService.findOne(
                expense.bankTransactionId,
            );

            await txn.bankTransaction.update({
                where: {
                    id: expense.bankTransactionId,
                },
                data: {
                    spentAmount: transaction.spentAmount + expense.amount,
                },
            });

            return expense;
        });
    }

    async removeMany(ids: string[]) {
        // const { count } = await this.prismaService.expense.deleteMany({
        //     where: {
        //         id: {
        //             in: ids,
        //         },
        //     },
        // });

        return 0;
    }

    async getSuggestions(userId: number, bankTransactionId: string) {
        // const expense = await this.httpService.get();
        const response = await firstValueFrom(
            this.httpService
                .get<Expense>("/expense/suggestion/", {
                    baseURL: "http://0.0.0.0:8000",
                    // headers: { Authorization: `Apikey ${apiKey}` },
                    params: {
                        userId,
                        bankTransactionId,
                    },
                })
                .pipe(),
        );

        return response.data;
    }
}
