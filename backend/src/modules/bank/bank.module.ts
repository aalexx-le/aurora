import { Module } from "@nestjs/common";
import { BankAccountService } from "./account/account.service";
import { BankManagerResolver } from "./account/manager.resolver";
import { HttpModule } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { BankAccountResolver } from "./account/account.resolver";
import { BankTransactionResolver } from "./transaction/transaction.resolver";
import { ScheduleModule } from "@nestjs/schedule";
import { BankTransactionService } from "./transaction/transaction.service";

const CassoHttpModule = HttpModule.registerAsync({
    useFactory: (configService: ConfigService) => ({
        baseURL: configService.get("BANK_API_URL"),
    }),
    inject: [ConfigService],
});

@Module({
    imports: [ScheduleModule.forRoot(), CassoHttpModule],
    providers: [
        BankManagerResolver,
        BankAccountResolver,
        BankTransactionResolver,
        BankAccountService,
        BankTransactionService,
    ],
    exports: [BankAccountService, BankTransactionService, CassoHttpModule],
})
export class BankModule {}
