import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import {
    CreateAutoBankManagerInput,
    CreateBankManagerArgs,
    CreateBankManagerInput,
} from "./dto/create-bank-manager.input";
import { PrismaService } from "nestjs-prisma";
import { GetBankAccountNetworkOutput } from "./dto/get-bank-account-network.output";
import { AutoBankManager } from "../../../entities/auto-bank-manager";
import { CreateBankAccountInput } from "./dto/create-bank-account.input";

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

    async getBankAccountsByManagerId(bankManagerId: string) {
        return this.prisma.bankAccount.findMany({
            where: { bankManagerId },
        });
    }

    async getBankAccounts(userId: number) {
        return this.prisma.bankAccount.findMany({
            where: {
                bankManager: {
                    userId,
                },
            },
        });
    }

    async getBankAccount(bankId: string) {
        return this.prisma.bankAccount.findUnique({
            where: { id: bankId },
        });
    }

    async createBankManager(userId: number, args: CreateBankManagerArgs) {
        const autoBankManager: CreateAutoBankManagerInput =
            args.data.autoBankManager;

        if (autoBankManager) {
            const { data } = await this.fetchBankAccounts(
                autoBankManager.apiKey,
            );

            const bankManagerId = data.user.id.toString();
            const bankManager = await this.prisma.bankManager.create({
                data: {
                    id: bankManagerId,
                    userId,
                    name: args.data.name,
                },
            });

            await this.prisma.autoBankManager.create({
                data: {
                    bankManagerId,
                    apiKey: autoBankManager.apiKey,
                    thirdParty: autoBankManager.thirdParty,
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
        } else {
            return this.prisma.bankManager.create({
                data: {
                    userId,
                    name: args.data.name,
                },
            });
        }
    }

    async createBankAccount(data: CreateBankAccountInput) {
        return this.prisma.bankAccount.create({
            data,
        });
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

    async getAutoBankManager(bankManagerId: string) {
        return this.prisma.autoBankManager.findUnique({
            where: { bankManagerId },
        });
    }
}
