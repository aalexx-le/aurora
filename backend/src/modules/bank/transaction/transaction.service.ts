import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { PrismaService } from "nestjs-prisma";
import { Cron, CronExpression } from "@nestjs/schedule";
import { GetTransactionNetworkOutput } from "./dto/get-transaction-network.output";
import { firstValueFrom } from "rxjs";

@Injectable()
export class BankTransactionService {
    private readonly logger = new Logger(BankTransactionService.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly prisma: PrismaService,
    ) {}

    async findOne(bankTransactionId: string) {
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
        bankTransactionId: string,
        data: { spentAmount: number }, // TODO: update this interface if needed
    ) {
        return this.prisma.bankTransaction.update({
            where: { id: bankTransactionId },
            data,
        });
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    private async pollingTransactions() {
        this.logger.log("Polling transactions...");
        const bankManagers = await this.prisma.bankManager.findMany();

        for (const bankManager of bankManagers) {
            const lastTransaction = await this.prisma.bankTransaction.findFirst(
                {
                    where: { bank: { bankManagerId: bankManager.id } },
                    orderBy: { createdAt: "desc" },
                },
            );

            const { data } = await this.fetchTransactions(bankManager.apiKey);

            const lastTransactionId: number = lastTransaction
                ? Number(lastTransaction.id)
                : 0;
            const latestTransactions = data.records.filter(
                (r) => r.id > lastTransactionId,
            );
            this.logger.log(
                `Process ${latestTransactions.length} bank transactions for bank manager ${bankManager.id}`,
            );

            for (const transaction of latestTransactions) {
                const bankId = transaction.accountId.toString();
                await this.prisma.bankTransaction.create({
                    data: {
                        id: transaction.id.toString(),
                        bankId,
                        amount: transaction.amount,
                        spentAmount: transaction.amount,
                        description: transaction.description,
                        createdAt: new Date(transaction.when),
                    },
                });

                await this.prisma.bankAccount.update({
                    where: { id: bankId },
                    data: { balance: transaction.cusumBalance },
                });
            }
        }
    }

    private async fetchTransactions(
        apiKey: string,
        fromDate?: string,
    ): Promise<GetTransactionNetworkOutput> {
        const response = await firstValueFrom(
            this.httpService
                .get("/v2/transactions", {
                    headers: { Authorization: `Apikey ${apiKey}` },
                    params: { fromDate, sort: "DESC" },
                })
                .pipe(),
        );

        return response.data;
    }
}
