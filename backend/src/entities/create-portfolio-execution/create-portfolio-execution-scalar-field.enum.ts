import { registerEnumType } from '@nestjs/graphql';

export enum CreatePortfolioExecutionScalarFieldEnum {
    id = "id",
    userId = "userId",
    currentStep = "currentStep",
    currentMilestone = "currentMilestone",
    progressPercent = "progressPercent",
    errorMessage = "errorMessage",
    recoveryAction = "recoveryAction",
    retryCount = "retryCount",
    maxRetries = "maxRetries",
    exchangeType = "exchangeType",
    executionContext = "executionContext",
    createdAt = "createdAt",
    updatedAt = "updatedAt",
    completedAt = "completedAt"
}


registerEnumType(CreatePortfolioExecutionScalarFieldEnum, { name: 'CreatePortfolioExecutionScalarFieldEnum', description: undefined })
