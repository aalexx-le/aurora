import { registerEnumType } from '@nestjs/graphql';

export enum PaymentStatus {
    authorized = "authorized",
    authorized_flagged = "authorized_flagged",
    canceled = "canceled",
    captured = "captured",
    error = "error",
    action_required = "action_required",
    pending_no_action_required = "pending_no_action_required",
    created = "created",
    unknown = "unknown",
    dropped = "dropped"
}


registerEnumType(PaymentStatus, { name: 'PaymentStatus', description: undefined })
