const AUTH_ROUTE = {
    value: "/auth",
    login: {
        value: "/auth/login",
    },
    signup: {
        value: "/auth/signup",
    },
    verifyAccount: {
        value: "/auth/verifyAccount",
    },
    resetPassword: {
        value: "/auth/reset-password",
    },
    forgotPassword: {
        value: "/auth/forgot-password",
    },
    callback: {
        google: {
            value: "/auth/callback/google",
        },
    },
};

export default AUTH_ROUTE;
