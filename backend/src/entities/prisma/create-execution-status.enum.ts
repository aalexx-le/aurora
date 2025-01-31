import { registerEnumType } from '@nestjs/graphql';

export enum CreateExecutionStatus {
    QUEUE = "QUEUE",
    PROCESSING = "PROCESSING",
    FAILED = "FAILED",
    SUCCESS = "SUCCESS"
}


registerEnumType(CreateExecutionStatus, { name: 'CreateExecutionStatus', description: undefined })
