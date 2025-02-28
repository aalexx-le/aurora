import {
    Args,
    Int,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from "@nestjs/graphql";
import { AutoBankManager } from "src/entities/auto-bank-manager";
import { BankAccount } from "src/entities/bank-account";
import { BankManager } from "src/entities/bank-manager";
import { BankAccountService } from "./account.service";
import { CreateBankManagerArgs } from "./dto/create-bank-manager.input";
import { UseGuards } from "@nestjs/common";
import { JwtGuard } from "../../auth/guards/jwt.guard";
import { AuthUser } from "../../../shared/decorators/auth-user.decorator";
import { User } from "../../../entities/user";

@UseGuards(JwtGuard)
@Resolver(() => BankManager)
export class BankManagerResolver {
    constructor(private readonly bankService: BankAccountService) {}
    @Query(() => [BankManager], { name: "getBankManagers" })
    getBankManagers(@AuthUser() user: User) {
        return this.bankService.getBankManagers(user.id);
    }

    @ResolveField("banks", () => [BankAccount])
    bankAccounts(@Parent() bankManager: BankManager) {
        return this.bankService.getBankAccountsByManagerId(bankManager.id);
    }

    @ResolveField("autoBankManager", () => AutoBankManager, { nullable: true })
    async autoBankManager(@Parent() bankManager: BankManager) {
        return this.bankService.getAutoBankManager(bankManager.id);
    }

    @Mutation(() => BankManager, { name: "createBankManager" })
    createBankManager(
        @AuthUser() user: User,
        @Args() args: CreateBankManagerArgs,
    ) {
        return this.bankService.createBankManager(user.id, args);
    }
}
