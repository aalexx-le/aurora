const DASHBOARD_ROUTE = {
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
    agent: {
        chatbot: {
            value: "/agent/chatbot",
        },
    },
};

export default DASHBOARD_ROUTE;
