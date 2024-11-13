const DASHBOARD_ROUTE = {
    value: "/dashboard",
    finance: {
        value: "/finance",
        investment: {
            value: "/dashboard/finance/investment",
        },
        bankManagement: {
            value: "/dashboard/finance/bank-management",
        },
        assetPrice: {
            value: (assetInfoId: string) =>
                `/dashboard/finance/asset-price/${assetInfoId}`,
        },
    },
};

export default DASHBOARD_ROUTE;
