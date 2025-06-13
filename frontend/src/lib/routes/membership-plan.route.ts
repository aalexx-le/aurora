const MEMBERSHIP_ROUTE = {
    plan: {
        value: "/plan",
    },
    payment: {
        value: "/payment",
        metamask: {
            value: (sessionId: string) => `/payment/metamask/${sessionId}`,
        }
    }
};

export default MEMBERSHIP_ROUTE;