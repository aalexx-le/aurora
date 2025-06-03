import { registerEnumType } from '@nestjs/graphql';

export enum ErrorRecoveryAction {
    RETRY_AUTOMATIC = "RETRY_AUTOMATIC",
    RETRY_MANUAL = "RETRY_MANUAL",
    UPDATE_CREDENTIALS = "UPDATE_CREDENTIALS",
    WAIT_RATE_LIMIT = "WAIT_RATE_LIMIT",
    CHECK_PERMISSIONS = "CHECK_PERMISSIONS",
    CONTACT_SUPPORT = "CONTACT_SUPPORT",
    ABORT = "ABORT"
}


registerEnumType(ErrorRecoveryAction, { name: 'ErrorRecoveryAction', description: undefined })
