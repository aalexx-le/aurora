const DASHBOARD_ROUTE = {
    finance: {
        value: "/finance",
        investment: {
            value: "/finance/investment",
        },
        assetPrice: {
            value: (assetInfoId: string) =>
                `/finance/asset-price/${assetInfoId}`,
        },
    },
};

export default DASHBOARD_ROUTE;
