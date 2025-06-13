import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { MembershipSubscription } from "src/entities/membership-subscription/membership-subscription.model";
import { User } from "src/entities/user/user.model";
import { JwtGuard } from "src/modules/auth/guards/jwt.guard";
import { AuthUser } from "src/shared/decorators/auth-user.decorator";
import { PaddleCancelSubscriptionDto } from "./dtos/cancel-subscription.dto";
import {
    CreateCustomerPortalSessionDto,
    CustomerPortalSessionResponse,
} from "./dtos/customer-portal-session.dto";
import { PaddleReactivateSubscriptionDto } from "./dtos/reactivate-subscription.dto";
import { PaddleSubscriptionService } from "./paddle-subscription.service";

@Resolver(() => MembershipSubscription)
export class PaddleResolver {
    constructor(
        private readonly paddleSubscriptionService: PaddleSubscriptionService,
    ) {}

    @UseGuards(JwtGuard)
    @Mutation(() => MembershipSubscription, {
        name: "cancelPaddleSubscription",
    })
    async cancelSubscription(@Args() args: PaddleCancelSubscriptionDto) {
        return this.paddleSubscriptionService.cancelSubscription(args.id);
    }

    @UseGuards(JwtGuard)
    @Mutation(() => MembershipSubscription, {
        name: "reactivatePaddleSubscription",
    })
    async reactivateSubscription(
        @Args() args: PaddleReactivateSubscriptionDto,
    ) {
        return this.paddleSubscriptionService.reactivateSubscription(args.id);
    }

    @UseGuards(JwtGuard)
    @Mutation(() => CustomerPortalSessionResponse, {
        name: "createCustomerPortalSession",
    })
    async createCustomerPortalSession(
        @Args() args: CreateCustomerPortalSessionDto,
        @AuthUser() user: User,
    ) {
        return this.paddleSubscriptionService.createCustomerPortalSession(
            user.id,
            args.subscriptionIds,
        );
    }
}
