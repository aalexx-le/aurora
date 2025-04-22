import { UseGuards } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";
import { User } from "@prisma/client";
import { PaymentMethod } from "src/entities/payment-method";
import { AuthUser } from "../../shared/decorators/auth-user.decorator";
import { JwtGuard } from "../auth/guards/jwt.guard";
import { GetPaymentMethodArgs } from "./dtos/payment-method.dto";
import { PaymentService } from "./payment.service";

@Resolver(() => PaymentMethod)
@UseGuards(JwtGuard)
export class PaymentResolver {
    constructor(private readonly paymentService: PaymentService) {}

    @Query(() => PaymentMethod, { name: "getPaymentMethod", nullable: true })
    async getPaymentMethod(@Args() args: GetPaymentMethodArgs) {
        return this.paymentService.getPaymentMethod(args.data);
    }

    @Query(() => [PaymentMethod], { name: "getPaymentMethods" })
    async getPaymentMethods(@AuthUser() user: User) {
        return this.paymentService.getPaymentMethods(user.id);
    }
}
