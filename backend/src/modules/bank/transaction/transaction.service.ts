import { HttpService } from "@nestjs/axios";
import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "nestjs-prisma";
import { CreateBankTransactionInput } from "./dto/create-bank-transaction.input";

@Injectable()
export class BankTransactionService {
    private readonly logger = new Logger(BankTransactionService.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly prisma: PrismaService,
    ) {}

    async findHistoricalBalances(bankAccountId: string) {
        return this.prisma.historicalBankBalance.findMany({
            where: { bankAccountId },
            orderBy: { time: "asc" },
        });
    }

    async findOne(bankTransactionId: number) {
        return this.prisma.bankTransaction.findUnique({
            where: { id: bankTransactionId },
        });
    }

    async findManyByBankId(bankId: string) {
        return this.prisma.bankTransaction.findMany({
            where: { bankId },
            orderBy: { createdAt: "desc" },
        });
    }

    async findManyByUserId(userId: number) {
        return this.prisma.bankTransaction.findMany({
            where: {
                bank: {
                    bankManager: {
                        userId,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async updateOne(
        bankTransactionId: number,
        data: { spentAmount: number }, // TODO: update this interface if needed
    ) {
        return this.prisma.bankTransaction.update({
            where: { id: bankTransactionId },
            data,
        });
    }

    async create(data: CreateBankTransactionInput) {
        return this.prisma.$transaction(async (prisma) => {
            const bankAccount = await prisma.bankAccount.findUnique({
                where: { id: data.bankId },
            });

            const newBalance = bankAccount.balance + data.amount;

            if (newBalance < 0) {
                throw new Error("Insufficient balance");
            }

            await prisma.bankAccount.update({
                where: { id: data.bankId },
                data: {
                    balance: newBalance,
                },
            });

            return prisma.bankTransaction.create({
                data: {
                    ...data,
                    spentAmount: data.amount,
                },
            });
        });
    }

    async remove(id: number) {
        return this.prisma.$transaction(async (prisma) => {
            const transaction = await prisma.bankTransaction.findUnique({
                where: { id },
            });

            const bankAccount = await prisma.bankAccount.findUnique({
                where: { id: transaction.bankId },
            });

            const newBalance = bankAccount.balance - transaction.amount;

            await prisma.bankAccount.update({
                where: { id: transaction.bankId },
                data: { balance: newBalance },
            });

            await prisma.expense.deleteMany({
                where: {
                    bankTransactionId: id,
                },
            });

            return prisma.bankTransaction.delete({
                where: { id },
            });
        });
    }
}
