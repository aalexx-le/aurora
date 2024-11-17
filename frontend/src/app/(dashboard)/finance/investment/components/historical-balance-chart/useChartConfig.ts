import { useMemo } from "react";
import { GetCryptoPortfolioQuery } from "@/gql/graphql";

export const useChartConfig = (
    historicalData: GetCryptoPortfolioQuery["getCryptoPortfolios"][number]["historicalBalances"],
) => {
    return useMemo(
        () => ({
            trend:
                historicalData[historicalData.length - 1]?.estimatedBalance >=
                historicalData[0]?.estimatedBalance
                    ? {
                          label: "Up",
                          color: "hsl(var(--chart-2))",
                      }
                    : {
                          label: "Down",
                          color: "hsl(var(--chart-5))",
                      },
        }),
        [historicalData],
    );
};
