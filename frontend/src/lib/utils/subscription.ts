import { MembershipSubscriptionStatus } from "@/gql/graphql";

/**
 * Format a date string to a more readable format
 */
export const formatDate = (dateString: string | Date): string => {
    if (!dateString) return "N/A";

    const date =
        typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

/**
 * Get the appropriate color class for a subscription status badge
 */
export const getStatusColor = (
    status?: MembershipSubscriptionStatus,
): string => {
    if (!status) return "bg-gray-100 text-gray-800";

    switch (status) {
        case MembershipSubscriptionStatus.Active:
        case MembershipSubscriptionStatus.Trialing:
            return "bg-green-100 text-green-800";
        case MembershipSubscriptionStatus.PastDue:
            return "bg-yellow-100 text-yellow-800";
        case MembershipSubscriptionStatus.Canceled:
            return "bg-red-100 text-red-800";
        case MembershipSubscriptionStatus.Paused:
            return "bg-blue-100 text-blue-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

/**
 * Determine if subscription management buttons should be disabled
 */
export const isButtonDisabled = (
    status?: MembershipSubscriptionStatus,
    isPaddleLoading = false,
): boolean => {
    if (isPaddleLoading) return true;

    if (!status) return true;

    // Can't manage subscriptions that are already canceled
    if (status === MembershipSubscriptionStatus.Canceled) {
        return true;
    }

    return false;
};

/**
 * Check if a subscription is active (includes trial period)
 */
export const isSubscriptionActive = (
    status?: MembershipSubscriptionStatus,
): boolean => {
    if (!status) return false;

    return [
        MembershipSubscriptionStatus.Active,
        MembershipSubscriptionStatus.Trialing,
    ].includes(status);
};

/**
 * Get a human-readable description for a subscription status
 */
export const getStatusDescription = (
    status?: MembershipSubscriptionStatus,
): string => {
    if (!status) return "Unknown status";

    switch (status) {
        case MembershipSubscriptionStatus.Active:
            return "Your subscription is active and will renew automatically.";
        case MembershipSubscriptionStatus.Trialing:
            return "You are currently in a trial period.";
        case MembershipSubscriptionStatus.PastDue:
            return "Your payment has failed. Please update your payment method.";
        case MembershipSubscriptionStatus.Canceled:
            return "Your subscription is canceled. You will have access until the end of the billing period.";
        case MembershipSubscriptionStatus.Paused:
            return "Your subscription is paused. You will not be charged until it resumes.";
        default:
            return "Unknown subscription status.";
    }
};
