import { ArgsType } from "@nestjs/graphql";
import { CancelSubscriptionArgs } from "src/modules/membership/subscription/dtos/cancel-subscription.dto";

@ArgsType()
export class PaddleCancelSubscriptionDto extends CancelSubscriptionArgs {}
