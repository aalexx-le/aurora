import {
    CEXExchanges,
    ErrorRecoveryAction,
    PortfolioCreationMilestone,
    PortfolioCreationStep
} from "../../../../entities/prisma";

/**
 * Enhanced Portfolio Creation Event Payload
 * Comprehensive interface for enum-based progress tracking with smart error recovery
 */
export interface PortfolioCreationEvent {
    // Core identification
    executionId: number;
    userId: number;
    
    // Progress tracking with enums
    currentStep: PortfolioCreationStep;
    currentMilestone: PortfolioCreationMilestone;
    progressPercent: number;
    
    // Error handling and recovery
    errorMessage?: string | null;
    recoveryAction?: ErrorRecoveryAction | null;
    retryCount: number;
    maxRetries: number;
    
    // Portfolio context
    exchangeType: CEXExchanges;
    executionContext?: any | null; // JSON field for additional context
    
    // Timestamps
    timestamp: Date;
    updatedAt: Date;
    completedAt?: Date | null;
    
    // Event metadata
    eventType: 'PROGRESS_UPDATE' | 'ERROR_OCCURRED' | 'RECOVERY_ATTEMPTED' | 'COMPLETED' | 'FAILED';
    
    // Kafka metadata
    offset?: string;
    partition?: number;
}

/**
 * Subscription Event Payload for GraphQL
 */
export interface PortfolioCreationSubscriptionPayload {
    execution: PortfolioCreationEvent;
    isRealTimeUpdate: boolean;
    source: 'KAFKA_EVENT' | 'DATABASE_QUERY';
} 