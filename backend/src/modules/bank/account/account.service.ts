import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import { CreateBankManagerArgs } from "./dto/create-bank-manager.input";
import { PrismaService } from "nestjs-prisma";
import { GetBankAccountNetworkOutput } from "./dto/get-bank-account-network.output";

@Injectable()
export class BankAccountService {
    private readonly logger = new Logger(BankAccountService.name);

    constructor(
        private readonly httpService: HttpService,
        private readonly prisma: PrismaService,
    ) {}

    async getBankManagers(userId: number) {
        return this.prisma.bankManager.findMany({
            where: { userId },
        });
    }

    async getBankAccounts(bankManagerId: string) {
        return this.prisma.bankAccount.findMany({
            where: { bankManagerId },
        });
    }

    async getBankAccount(bankId: string) {
        return this.prisma.bankAccount.findUnique({
            where: { id: bankId },
        });
    }

    async createBankManager(args: CreateBankManagerArgs) {
        const { data } = await this.fetchBankAccounts(args.data.apiKey);

        const bankManagerId = data.user.id.toString();
        const bankManager = await this.prisma.bankManager.create({
            data: {
                id: bankManagerId,
                userId: args.data.userId,
                name: args.data.name,
                apiKey: args.data.apiKey,
            },
        });

        for (const account of data.bankAccs) {
            await this.prisma.bankAccount.create({
                data: {
                    id: account.id.toString(),
                    fullName: account.bank.fullName,
                    name: account.memo,
                    bankManagerId,
                    balance: account.balance,
                    accountName: account.bankAccountName,
                    accountNumber: account.bankSubAccId,
                },
            });
        }

        return bankManager;
    }

    private async fetchBankAccounts(
        apiKey: string,
    ): Promise<GetBankAccountNetworkOutput> {
        const response = await firstValueFrom(
            this.httpService
                .get("/v2/userInfo", {
                    headers: { Authorization: `Apikey ${apiKey}` },
                })
                .pipe(),
        );

        return response.data;
    }
}
