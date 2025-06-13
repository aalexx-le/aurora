"use client";

import { CREATE_CUSTOMER_PORTAL_SESSION } from "@/api/membership/subscription";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";

interface CustomerPortalSessionResponse {
    id: string;
    customerId: string;
    urls: {
        general: string;
    };
    createdAt: string;
}

interface CreateCustomerPortalSessionVariables {
    subscriptionIds?: string[];
}

export const useCustomerPortalSession = () => {
    const [createPortalSession, { loading, error }] = useMutation(
        CREATE_CUSTOMER_PORTAL_SESSION,
    );

    const openCustomerPortal = async (subscriptionIds?: string[]) => {
        try {
            const { data } = await createPortalSession({
                variables: { subscriptionIds },
            });

            if (data?.createCustomerPortalSession?.urls?.general) {
                // Open the customer portal in a new tab
                window.open(
                    data.createCustomerPortalSession.urls.general.overview,
                    "_blank",
                );
                toast.success("Opening customer portal...");
            } else {
                throw new Error("No portal URL received");
            }
        } catch (err) {
            console.error("Error creating customer portal session:", err);
            toast.error("Failed to open customer portal. Please try again.");
        }
    };

    return {
        openCustomerPortal,
        loading,
        error,
    };
};
