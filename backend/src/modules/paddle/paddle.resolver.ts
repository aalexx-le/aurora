import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { MembershipSubscription } from "src/entities/membership-subscription/membership-subscription.model";
import { JwtGuard } from "src/modules/auth/guards/jwt.guard";
import { PaddleCancelSubscriptionDto } from "./dtos/cancel-subscription.dto";
import { PaddleReactivateSubscriptionDto } from "./dtos/reactivate-subscription.dto";
import { PaddleService } from "./paddle.service";

@Resolver(() => MembershipSubscription)
export class PaddleResolver {
    constructor(private readonly paddleService: PaddleService) {}

    @UseGuards(JwtGuard)
    @Mutation(() => MembershipSubscription, {
        name: "cancelPaddleSubscription",
    })
    async cancelSubscription(@Args() args: PaddleCancelSubscriptionDto) {
        return this.paddleService.cancelSubscription(args.id);
    }

    @UseGuards(JwtGuard)
    @Mutation(() => MembershipSubscription, {
        name: "reactivatePaddleSubscription",
    })
    async reactivateSubscription(
        @Args() args: PaddleReactivateSubscriptionDto,
    ) {
        return this.paddleService.reactivateSubscription(args.id);
    }
}
