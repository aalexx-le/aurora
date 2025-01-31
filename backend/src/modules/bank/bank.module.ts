import { Module } from "@nestjs/common";
import { BankAccountService } from "./account/account.service";
import { BankManagerResolver } from "./account/manager.resolver";
import { HttpModule } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { BankAccountResolver } from "./account/account.resolver";
import { BankTransactionResolver } from "./transaction/transaction.resolver";
import { ScheduleModule } from "@nestjs/schedule";
import { BankTransactionService } from "./transaction/transaction.service";
import { KafkaModule, KafkaModuleOptions } from "@claudeseo/nest-kafka";
import { BankTransactionCron } from "./transaction/transaction.cron";

const CassoHttpModule = HttpModule.registerAsync({
    useFactory: (configService: ConfigService) => ({
        baseURL: configService.get("BANK_API_URL"),
    }),
    inject: [ConfigService],
});

const KafkaModuleAsync = KafkaModule.registerAsync({
    inject: [ConfigService],
    useFactory: async (
        configService: ConfigService,
    ): Promise<KafkaModuleOptions> => {
        const broker = configService.get("MESSAGE_BROKER_URL");
        return {
            consume_method: "each",
            options: {
                client: {
                    brokers: [broker],
                    clientId: "nestjs-kafka",
                },
                consumer: {
                    groupId: "backend-server",
                    allowAutoTopicCreation: true,
                },
                producer: {
                    allowAutoTopicCreation: true,
                },
                subscribe: {
                    fromBeginning: false,
                },
                run: {
                    autoCommit: true,
                },
            },
        };
    },
});

@Module({
    imports: [ScheduleModule.forRoot(), CassoHttpModule, KafkaModuleAsync],
    providers: [
        BankManagerResolver,
        BankAccountResolver,
        BankTransactionResolver,
        BankAccountService,
        BankTransactionService,

        BankTransactionCron,
    ],
    exports: [
        BankAccountService,
        BankTransactionService,
        CassoHttpModule,
        KafkaModuleAsync,
    ],
})
export class BankModule {}
