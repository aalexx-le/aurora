import {
    CREATE_SUPPORT_TICKET,
    GET_CREATE_PORTFOLIO_EXECUTIONS,
    RETRY_PORTFOLIO_CREATION,
    UPDATE_PORTFOLIO_CREDENTIALS,
} from "@/api/crypto/execution";
import {
    CreateSupportTicketInput,
    CreateSupportTicketMutation,
    CreateSupportTicketMutationVariables,
    RetryPortfolioCreationMutation,
    RetryPortfolioCreationMutationVariables,
    UpdateCredentialsInput,
    UpdatePortfolioCredentialsMutation,
    UpdatePortfolioCredentialsMutationVariables,
} from "@/gql/graphql";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";

// Hook for retrying portfolio creation
export function useRetryPortfolioCreation() {
    const [retryMutation, { loading, error }] = useMutation<
        RetryPortfolioCreationMutation,
        RetryPortfolioCreationMutationVariables
    >(RETRY_PORTFOLIO_CREATION, {
        refetchQueries: [{ query: GET_CREATE_PORTFOLIO_EXECUTIONS }],
        onCompleted: () => {
            toast.success("Portfolio creation retry initiated successfully");
        },
        onError: (error) => {
            toast.error(`Failed to retry portfolio creation: ${error.message}`);
        },
    });

    const retry = async (executionId: number) => {
        try {
            await retryMutation({
                variables: { executionId },
            });
        } catch (err) {
            // Error is handled by onError callback
            console.error("Retry mutation error:", err);
        }
    };

    return {
        retry,
        loading,
        error,
    };
}

// Hook for updating portfolio credentials
export function useUpdateCredentials() {
    const [updateMutation, { loading, error }] = useMutation<
        UpdatePortfolioCredentialsMutation,
        UpdatePortfolioCredentialsMutationVariables
    >(UPDATE_PORTFOLIO_CREDENTIALS, {
        refetchQueries: [{ query: GET_CREATE_PORTFOLIO_EXECUTIONS }],
        onCompleted: () => {
            toast.success(
                "Credentials updated and portfolio creation restarted",
            );
        },
        onError: (error) => {
            toast.error(`Failed to update credentials: ${error.message}`);
        },
    });

    const updateCredentials = async (
        executionId: number,
        credentials: UpdateCredentialsInput,
    ) => {
        try {
            await updateMutation({
                variables: {
                    executionId,
                    credentials,
                },
            });
        } catch (err) {
            // Error is handled by onError callback
            console.error("Update credentials mutation error:", err);
        }
    };

    return {
        updateCredentials,
        loading,
        error,
    };
}

// Hook for creating support tickets
export function useCreateSupportTicket() {
    const [createTicketMutation, { loading, error }] = useMutation<
        CreateSupportTicketMutation,
        CreateSupportTicketMutationVariables
    >(CREATE_SUPPORT_TICKET, {
        onCompleted: () => {
            toast.success(
                "Support ticket created successfully. Our team will contact you shortly.",
            );
        },
        onError: (error) => {
            toast.error(`Failed to create support ticket: ${error.message}`);
        },
    });

    const createSupportTicket = async (data: CreateSupportTicketInput) => {
        try {
            await createTicketMutation({
                variables: { data },
            });
        } catch (err) {
            // Error is handled by onError callback
            console.error("Create support ticket mutation error:", err);
        }
    };

    return {
        createSupportTicket,
        loading,
        error,
    };
}
