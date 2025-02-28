import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { PrismaService } from "nestjs-prisma";
import { Cron, CronExpression } from "@nestjs/schedule";
import { GetTransactionNetworkOutput } from "./dto/get-transaction-network.output";
import { firstValueFrom } from "rxjs";
import { InjectKafka, KafkaService } from "@claudeseo/nest-kafka";
import { KafkaTopic } from "../../../shared/constants/kafka";
import { CreateBankTransactionInput } from "./dto/create-bank-transaction.input";

@Injectable()
export class BankTransactionService {
    private readonly logger = new Logger(BankTransactionService.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly prisma: PrismaService,
        @InjectKafka() private readonly kafkaService: KafkaService,
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
        console.log({ data });
        return this.prisma.bankTransaction.create({
            data,
        });
    }
}
