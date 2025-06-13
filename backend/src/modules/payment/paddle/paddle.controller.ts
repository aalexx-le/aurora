import {
    Controller,
    Headers,
    HttpCode,
    HttpStatus,
    Post,
    RawBody,
} from "@nestjs/common";
import { PaddleService } from "./paddle.service";
import { PaddleWebhookService } from "./paddle-webhook.service";

@Controller("paddle")
export class PaddleController {
    constructor(private readonly paddleWebhookService: PaddleWebhookService) {}

    @Post("webhook")
    @HttpCode(HttpStatus.OK)
    async handleWebhook(
        @Headers("paddle-signature") signature: string,
        @RawBody() rawBody: Buffer,
    ) {
        await this.paddleWebhookService.processIncomingWebhook(
            signature,
            rawBody,
        );
    }
}
