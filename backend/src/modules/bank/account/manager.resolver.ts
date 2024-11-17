import {
    Args,
    Int,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from "@nestjs/graphql";
import { BankAccountService } from "./account.service";
import { CreateBankManagerArgs } from "./dto/create-bank-manager.input";
import { BankManager } from "src/entities/bank-manager";
import { BankAccount } from "src/entities/bank-account";

@Resolver(() => BankManager)
export class BankManagerResolver {
    constructor(private readonly bankService: BankAccountService) {}
    @Query(() => [BankManager], { name: "getBankManagers" })
    getBankManagers(@Args("userId", { type: () => Int }) userId: number) {
        return this.bankService.getBankManagers(userId);
    }

    @ResolveField("banks", () => [BankAccount])
    bankAccounts(@Parent() bankManager: BankManager) {
        return this.bankService.getBankAccounts(bankManager.id);
    }

    @Mutation(() => BankManager)
    createBank(@Args() args: CreateBankManagerArgs) {
        return this.bankService.createBankManager(args);
    }
}
