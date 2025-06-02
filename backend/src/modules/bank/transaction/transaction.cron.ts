import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { PrismaService } from "nestjs-prisma";
import { Cron, CronExpression } from "@nestjs/schedule";
import { GetTransactionNetworkOutput, Record } from "./dto/get-transaction-network.output";
import { firstValueFrom } from "rxjs";
import { KafkaTopic } from "../../../shared/constants/kafka";

@Injectable()
export class BankTransactionCron {
    private readonly logger = new Logger(BankTransactionCron.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly prisma: PrismaService,
    ) {}

    @Cron(CronExpression.EVERY_MINUTE)
    private async pollingTransactions() {
        this.logger.log("Polling transactions...");
        const autoBankManagers = await this.prisma.autoBankManager.findMany();

        for (const autoBankManager of autoBankManagers) {
            const lastTransaction = await this.prisma.bankTransaction.findFirst(
                {
                    where: {
                        bank: { bankManagerId: autoBankManager.bankManagerId },
                    },
                    orderBy: { createdAt: "desc" },
                },
            );

            const lastTransactionTime = lastTransaction.createdAt;
            lastTransactionTime.setDate(lastTransactionTime.getDate() - 1);

            const newTransactions = await this.fetchTransactions(
                autoBankManager.apiKey,
            );

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

            const latestTransactions = newTransactions.filter(
                (r) => r.id > lastTransactionId,
            );
            this.logger.log(
                `Process ${latestTransactions.length} bank transactions for auto bank manager ${autoBankManager.id} from ${newTransactions[0].when} to ${newTransactions[newTransactions.length - 1].when}`,
            );

            for (const transaction of latestTransactions) {
                console.log({ transaction });
                const bankId = transaction.accountId.toString();
                const txn_entity = await this.prisma.bankTransaction.create({
                    data: {
                        id: transaction.id,
                        bankId,
                        amount: transaction.amount,
                        spentAmount: transaction.amount,
                        description: transaction.description,
                        createdAt: new Date(transaction.when),
                    },
                });

                const msg = Buffer.from(JSON.stringify(txn_entity));
                // const res = await this.kafkaService.sendMessage({
                //     topic: KafkaTopic.EMBED_TRANSACTION,
                //     messages: [{ value: msg }],
                // });
                // this.logger.log(
                //     `Message sent to topic(${KafkaTopic.EMBED_TRANSACTION}): ${msg} with result: ${res}`,
                // );

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
    ): Promise<Record[]> {
        try {
            const response: { data: GetTransactionNetworkOutput } = await firstValueFrom(
                this.httpService
                    .get("/v2/transactions", {
                        headers: { Authorization: `Apikey ${apiKey}` },
                        params: { fromDate, sort: "DESC", pageSize: 30 },
                    })
                    .pipe(),
                );

            return response.data.data.records;
        } catch (error) {
            this.logger.error(`Error fetching transactions: ${error}`);
            return [];
        }
    }
}
