const DASHBOARD_ROUTE = {
    value: "/dashboard",
    finance: {
        value: "/finance",
        expense: {
            value: "/finance/expense",
        },
        investment: {
            value: "/finance/investment",
            assetProfit: {
                value: (portfolioId: string, assetInfoId: string) =>
                    `/finance/investment/asset-profit/${assetInfoId}/${portfolioId}`,
            },
        },
        assetPrice: {
            value: (assetInfoId: string) =>
                `/finance/asset-price/${assetInfoId}`,
        },
    },
    schedule: {
        value: "/schedule",
    },
    agent: {
        chatbot: {
            value: "/agent/chatbot",
        },
    },
};

export default DASHBOARD_ROUTE;
