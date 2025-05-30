import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SUBSCRIPTION_PUB_SUB_PROVIDER } from "src/shared/providers/pubsub";
import { PaddleWebhookService } from "./paddle-webhook.service";
import { PaddleController } from "./paddle.controller";
import { PaddleResolver } from "./paddle.resolver";
import { PaddleService } from "./paddle.service";
@Module({
    imports: [ConfigModule],
    controllers: [PaddleController],
    providers: [
        PaddleService,
        PaddleWebhookService,
        PaddleResolver,
        SUBSCRIPTION_PUB_SUB_PROVIDER,
    ],
    exports: [
        PaddleService,
        PaddleWebhookService,
        SUBSCRIPTION_PUB_SUB_PROVIDER,
    ],
})
export class PaddleModule {}
