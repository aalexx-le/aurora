import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SUBSCRIPTION_PUB_SUB_PROVIDER } from "src/shared/providers/pubsub";
import { MembershipModule } from "../membership/membership.module";
import { MetaMaskResolver } from "./metamask/metamask.resolver";
import { MetaMaskService } from "./metamask/metamask.service";
import { PaddleDiscountService } from "./paddle/paddle-discount.service";
import { PaddleProductService } from "./paddle/paddle-product.service";
import { PaddleSubscriptionService } from "./paddle/paddle-subscription.service";
import { PaddleWebhookService } from "./paddle/paddle-webhook.service";
import { PaddleController } from "./paddle/paddle.controller";
import { PaddleResolver } from "./paddle/paddle.resolver";
import { PaymentSessionResolver } from "./payment-session.resolver";
import { PaymentSessionService } from "./payment-session.service";
import { PaymentResolver } from "./payment.resolver";
import { PaymentService } from "./payment.service";

@Module({
    imports: [
        ConfigModule,
        forwardRef(() => MembershipModule),
    ],
    controllers: [PaddleController],
    providers: [
        PaymentResolver,
        MetaMaskResolver,
        PaddleResolver,
        PaymentSessionResolver,

        PaymentSessionService,
        MetaMaskService,
        PaddleSubscriptionService,
        PaddleProductService,
        PaddleDiscountService,
        PaddleWebhookService,
        PaymentService,
        SUBSCRIPTION_PUB_SUB_PROVIDER,
    ],
    exports: [
        PaymentService,
        PaddleProductService,
        PaddleWebhookService,
        PaymentSessionService,
        PaddleDiscountService,
    ],
})
export class PaymentModule {}
