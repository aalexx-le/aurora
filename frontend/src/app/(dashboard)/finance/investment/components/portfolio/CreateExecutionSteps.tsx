import { GET_CREATE_PORTFOLIO_EXECUTIONS } from "@/api/crypto/execution";
import { PORTFOLIO_CREATION_STATUS_SUBSCRIPTION } from "@/api/crypto/execution";
import {
    GetCreatePortfolioExecutionsQuery,
    GetCreatePortfolioExecutionsQueryVariables,
    OnPortfolioCreationStatusSubscription,
    PortfolioCreationMilestone
} from "@/gql/graphql";
import {
    useCreateSupportTicket,
    useRetryPortfolioCreation,
    useUpdateCredentials
} from "@/hooks/portfolio-recovery";
import { useQuery, useSubscription } from "@apollo/client";
import { useCallback, useState } from "react";
import { ErrorRecoveryCard } from "./ErrorRecoveryCard";
import { PortfolioExecutionProgress } from "./PortfolioExecutionProgress";
import { CredentialsUpdateModal } from "./CredentialsUpdateModal";
import { SupportTicketModal } from "./SupportTicketModal";

// Use the query result type directly
type ExecutionType = NonNullable<GetCreatePortfolioExecutionsQuery['getCreatePortfolioExecutions']>[0];

export function CreateExecutionSteps() {
    // State for modals
    const [showCredentialsModal, setShowCredentialsModal] = useState(false);
    const [showSupportModal, setShowSupportModal] = useState(false);
    const [selectedExecutionId, setSelectedExecutionId] = useState<number | null>(null);

    // Recovery hooks
    const { retry, loading: retryLoading } = useRetryPortfolioCreation();
    const { updateCredentials, loading: updateLoading } = useUpdateCredentials();
    const { createSupportTicket, loading: supportLoading } = useCreateSupportTicket();
    
    // Query for existing executions
    const {
        data,
        refetch
    } = useQuery<GetCreatePortfolioExecutionsQuery, GetCreatePortfolioExecutionsQueryVariables>(
        GET_CREATE_PORTFOLIO_EXECUTIONS, 
        {
            fetchPolicy: 'cache-and-network'
        }
    );

    useSubscription<OnPortfolioCreationStatusSubscription>(
        PORTFOLIO_CREATION_STATUS_SUBSCRIPTION,
        {
            onData: (options) => {
                const isCompleted = options.data.data?.onCreatePortfolioExecution.currentMilestone === PortfolioCreationMilestone.Completed;
                if (isCompleted) {
                    refetch();
                }
                // Refetch executions when we receive updates
                refetch();
            },
        }
    );

    // Filter out completed executions
    const executions = (data?.getCreatePortfolioExecutions || [])
        .filter(execution => execution.currentMilestone !== 'COMPLETED');


    // Handler functions for error recovery actions
    const handleRetry = useCallback((executionId: number) => {
        retry(executionId);
    }, [retry]);

    const handleUpdateCredentials = useCallback((executionId: number) => {
        setSelectedExecutionId(executionId);
        setShowCredentialsModal(true);
    }, []);

    const handleContactSupport = useCallback((executionId: number) => {
        setSelectedExecutionId(executionId);
        setShowSupportModal(true);
    }, []);

    const handleAbort = useCallback((executionId: number) => {
        // Note: Abort functionality not yet implemented in backend
        console.warn(`Abort requested for execution ${executionId} - not implemented`);
    }, []);

    // Helper to close modals and clear selection
    const closeModal = useCallback(() => {
        setShowCredentialsModal(false);
        setShowSupportModal(false);
        setSelectedExecutionId(null);
    }, []);

    // Credentials update handler
    const handleCredentialsSubmit = useCallback(async (credentials: { apiKey: string; secretKey: string; passphrase?: string }) => {
        if (selectedExecutionId) {
            await updateCredentials(selectedExecutionId, credentials);
            closeModal();
        }
    }, [updateCredentials, selectedExecutionId, closeModal]);

    // Support ticket handler
    const handleSupportSubmit = useCallback(async (ticket: { subject: string; description: string; category?: string; priority?: string }) => {
        if (selectedExecutionId) {
            await createSupportTicket({
                executionId: selectedExecutionId,
                ...ticket
            });
            closeModal();
        }
    }, [createSupportTicket, selectedExecutionId, closeModal]);

    // Categorize executions by status
    const isFailedExecution = (execution: ExecutionType) => 
        execution.currentMilestone === 'FAILED' || execution.currentMilestone?.includes('_FAILED');
    
    const failedExecutions = executions.filter(isFailedExecution);
    const activeExecutions = executions.filter(e => !isFailedExecution(e));

    return (
        <>
            {(failedExecutions.length > 0 || activeExecutions.length > 0) && (
                <div className="space-y-4">
                    {/* Error Recovery Cards for Failed Executions */}
                    {failedExecutions.length > 0 && (
                        <div className="space-y-3">
                            {failedExecutions.map((execution) => (
                                <ErrorRecoveryCard
                                    key={`error-${execution.id}`}
                                    executionId={execution.id}
                                    errorMessage={execution.errorMessage || "Unknown error occurred"}
                                    recoveryAction={execution.recoveryAction || null}
                                    currentMilestone={execution.currentMilestone}
                                    retryCount={execution.retryCount || 0}
                                    maxRetries={execution.maxRetries || 3}
                                    exchangeType={execution.exchangeType}
                                    onRetry={() => handleRetry(execution.id)}
                                    onUpdateCredentials={() => handleUpdateCredentials(execution.id)}
                                    onContactSupport={() => handleContactSupport(execution.id)}
                                    onAbort={() => handleAbort(execution.id)}
                                />
                            ))}
                        </div>
                    )}

                    {/* Active Portfolio Creation Progress */}
                    {activeExecutions.length > 0 && (
                        <div className="space-y-4">
                            {activeExecutions.map((execution) => (
                                <PortfolioExecutionProgress
                                    key={`progress-${execution.id}`}
                                    execution={execution}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Credentials Update Modal */}
            <CredentialsUpdateModal
                isOpen={showCredentialsModal}
                onClose={closeModal}
                onSubmit={handleCredentialsSubmit}
                loading={updateLoading}
            />

            {/* Support Ticket Modal */}
            <SupportTicketModal
                isOpen={showSupportModal}
                onClose={closeModal}
                onSubmit={handleSupportSubmit}
                loading={supportLoading}
                executionId={selectedExecutionId}
            />
        </>
    );
}