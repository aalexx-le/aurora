import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { MetaMaskPaymentMethod } from "src/entities/meta-mask-payment-method";
import { User } from "src/entities/user";
import { AuthUser } from "src/shared/decorators/auth-user.decorator";
import { JwtGuard } from "../../auth/guards/jwt.guard";
import {
    CreateMetaMaskPaymentMethodDto,
    CreateMetaMaskSubscriptionFromSessionDto,
    CryptoPriceResult,
} from "./dtos/metamask-payment.dto";
import { MetaMaskService } from "./metamask.service";

@Resolver(() => MetaMaskPaymentMethod)
@UseGuards(JwtGuard)
export class MetaMaskResolver {
    constructor(private readonly metaMaskService: MetaMaskService) {}

    @Mutation(() => Boolean, {
        name: "createMetaMaskPaymentMethod",
    })
    async createMetaMaskPaymentMethod(
        @Args("input") input: CreateMetaMaskPaymentMethodDto,
        @AuthUser() user: User,
    ) {
        await this.metaMaskService.createPaymentMethod(input, user.id);
        return true;
    }

    @Query(() => CryptoPriceResult, {
        name: "getCryptoPrice",
    })
    async getCryptoPrice(
        @Args("tokenSymbol") tokenSymbol: string,
        @Args("usdAmount", { type: () => Number }) usdAmount: number,
    ): Promise<CryptoPriceResult> {
        return await this.metaMaskService.getCryptoPrice(
            tokenSymbol,
            usdAmount,
        );
    }

    @Mutation(() => Boolean, {
        name: "createMetaMaskSubscriptionFromSession",
    })
    async createMetaMaskSubscriptionFromSession(
        @Args("input") input: CreateMetaMaskSubscriptionFromSessionDto,
        @AuthUser() user: User,
    ) {
        await this.metaMaskService.createMembershipSubscriptionFromSession(
            input,
            user.id,
        );
        return true;
    }
}
