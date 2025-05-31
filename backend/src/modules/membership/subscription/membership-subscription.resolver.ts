import { Inject, UseGuards } from "@nestjs/common";
import {
    Args,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
    Subscription,
} from "@nestjs/graphql";
import { PubSub } from "graphql-subscriptions";
import { PrismaService } from "nestjs-prisma";
import { MembershipPlan } from "src/entities/membership-plan/membership-plan.model";
import { MembershipSubscription } from "src/entities/membership-subscription/membership-subscription.model";
import { PaymentTransaction } from "src/entities/payment-transaction/payment-transaction.model";
import { User } from "src/entities/user/user.model";
import { JwtGuard } from "src/modules/auth/guards/jwt.guard";
import { SubscriptionEvent } from "src/shared/constants/subscription.event";
import { AuthUser } from "src/shared/decorators/auth-user.decorator";
import { PaddleWebhookService } from "../../paddle/paddle-webhook.service";
import { MembershipPlanService } from "../plan/membership-plan.service";
import { CreateSubscriptionArgs } from "./dtos/create-subscription.dto";
import { DeleteSubscriptionArgs } from "./dtos/delete-subscription.dto";
import { UpdateSubscriptionArgs } from "./dtos/update-subscription.dto";
import { MembershipSubscriptionService } from "./membership-subscription.service";

@UseGuards(JwtGuard)
@Resolver(() => MembershipSubscription)
export class MembershipSubscriptionResolver {
    constructor(
        private readonly subscriptionService: MembershipSubscriptionService,
        private readonly planService: MembershipPlanService,
        private readonly prisma: PrismaService,
        @Inject("SUBSCRIPTION_PUB_SUB") private readonly pubSub: PubSub,
    ) {}

    @Query(() => [MembershipSubscription], {
        name: "myActiveMembershipSubscriptions",
    })
    async getMyActiveSubscriptions(
        @AuthUser() user: User,
    ): Promise<MembershipSubscription[]> {
        return this.subscriptionService.findActivesByUser(user.id);
    }

    @Query(() => [MembershipSubscription], {
        name: "myMembershipSubscriptions",
    })
    async getMySubscriptions(
        @AuthUser() user: User,
    ): Promise<MembershipSubscription[]> {
        return this.subscriptionService.findByUser(user.id);
    }

    @Mutation(() => MembershipSubscription, {
        name: "createMembershipSubscription",
    })
    async createSubscription(
        @Args() args: CreateSubscriptionArgs,
    ): Promise<MembershipSubscription> {
        return this.subscriptionService.create(args.data);
    }

    @Mutation(() => MembershipSubscription, {
        name: "updateMembershipSubscription",
    })
    async updateSubscription(
        @Args() args: UpdateSubscriptionArgs,
    ): Promise<MembershipSubscription> {
        return this.subscriptionService.update(args.id, args.data);
    }

    @Mutation(() => Boolean, { name: "deleteMembershipSubscription" })
    async deleteSubscription(
        @Args() args: DeleteSubscriptionArgs,
    ): Promise<boolean> {
        return this.subscriptionService.delete(args.id);
    }

    @ResolveField("plan", () => MembershipPlan)
    async getPlan(@Parent() subscription: MembershipSubscription) {
        return this.planService.findOne(subscription.planId);
    }

    @ResolveField("user", () => User)
    async getUser(@Parent() subscription: MembershipSubscription) {
        return this.prisma.user.findUnique({
            where: { id: subscription.userId },
        });
    }

    @ResolveField("paymentTransactions", () => [PaymentTransaction])
    async getPaymentTransactions(
        @Parent() subscription: MembershipSubscription,
    ) {
        return this.prisma.paymentTransaction.findMany({
            where: { membershipSubscriptionId: subscription.id },
        });
    }

    @Subscription(() => MembershipSubscription, {
        name: PaddleWebhookService.MEMBERSHIP_SUBSCRIPTION_UPDATED_PAYLOAD_NAME,
        filter: (payload, _, context) => {
            const subscription = payload[
                PaddleWebhookService
                    .MEMBERSHIP_SUBSCRIPTION_UPDATED_PAYLOAD_NAME
            ] as MembershipSubscription;
            const userId = context.req?.user?.id;
            return subscription.userId === userId;
        },
    })
    onMembershipSubscriptionUpdated() {
        return this.pubSub.asyncIterator(
            SubscriptionEvent.MEMBERSHIP_SUBSCRIPTION_UPDATED,
        );
    }
}
