import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { User } from "src/entities/user";
import { AuthUser } from "src/shared/decorators/auth-user.decorator";
import { JwtGuard } from "../auth/guards/jwt.guard";
import {
    CreatePaymentSessionArgs,
    GetPaymentSessionArgs,
    PaymentSession,
} from "./dtos/payment-session.dto";
import { PaymentSessionService } from "./payment-session.service";

@Resolver(() => PaymentSession)
@UseGuards(JwtGuard)
export class PaymentSessionResolver {
    constructor(private readonly paymentSessionService: PaymentSessionService) {}

    @Mutation(() => PaymentSession, { name: "createPaymentSession" })
    async createPaymentSession(
        @Args() args: CreatePaymentSessionArgs,
        @AuthUser() user: User,
    ): Promise<PaymentSession> {
        return await this.paymentSessionService.createPaymentSession(
            args.data,
            user.id,
        );
    }

    @Query(() => PaymentSession, { name: "getPaymentSession" })
    async getPaymentSession(
        @Args() args: GetPaymentSessionArgs,
        @AuthUser() user: User,
    ): Promise<PaymentSession> {
        return this.paymentSessionService.getPaymentSession(
            args.data.sessionId,
            user.id,
        );
    }
} 