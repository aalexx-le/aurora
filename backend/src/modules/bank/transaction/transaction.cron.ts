import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { PrismaService } from "nestjs-prisma";
import { Cron, CronExpression } from "@nestjs/schedule";
import { GetTransactionNetworkOutput } from "./dto/get-transaction-network.output";
import { firstValueFrom } from "rxjs";
import { InjectKafka, KafkaService } from "@claudeseo/nest-kafka";
import { KafkaTopic } from "../../../shared/constants/kafka";

@Injectable()
export class BankTransactionCron {
    private readonly logger = new Logger(BankTransactionCron.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly prisma: PrismaService,
        @InjectKafka() private readonly kafkaService: KafkaService,
    ) {}

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

            // for (const transaction of data.records) {
            //     const bankId = transaction.accountId.toString();
            //     await this.prisma.historicalBankBalance.create({
            //         data: {
            //             bankAccountId: bankId,
            //             time: new Date(transaction.when),
            //             balance: transaction.cusumBalance,
            //         },
            //     });
            // }

            const latestTransactions = data.records.filter(
                (r) => r.id > lastTransactionId,
            );
            this.logger.log(
                `Process ${latestTransactions.length} bank transactions for bank manager ${bankManager.id}`,
            );

            for (const transaction of latestTransactions) {
                console.log({ transaction });
                const bankId = transaction.accountId.toString();
                const txn_entity = await this.prisma.bankTransaction.create({
                    data: {
                        id: transaction.id.toString(),
                        bankId,
                        amount: transaction.amount,
                        spentAmount: transaction.amount,
                        description: transaction.description,
                        createdAt: new Date(transaction.when),
                    },
                });

                const msg = Buffer.from(JSON.stringify(txn_entity));
                const res = await this.kafkaService.sendMessage({
                    topic: KafkaTopic.EMBED_TRANSACTION,
                    messages: [{ value: msg }],
                });
                this.logger.log(
                    `Message sent to topic(${KafkaTopic.EMBED_TRANSACTION}): ${msg} with result: ${res}`,
                );

                await this.prisma.historicalBankBalance.create({
                    data: {
                        bankAccountId: bankId,
                        time: new Date(transaction.when),
                        balance: transaction.cusumBalance,
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
                    params: { fromDate, sort: "DESC", pageSize: 30 },
                })
                .pipe(),
        );

        return response.data;
    }
}
