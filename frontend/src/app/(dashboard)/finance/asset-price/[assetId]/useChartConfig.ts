import { useMemo } from "react";
import { GetAssetQuery } from "@/gql/graphql";
import { ChartConfig } from "@/components/ui/chart";

export const useChartConfig = (
    historicalPrice: GetAssetQuery["getAssetPrices"],
) => {
    return useMemo(
        (): ChartConfig => ({
            trend:
                historicalPrice[historicalPrice.length - 1]?.openPrice >=
                historicalPrice[0]?.openPrice
                    ? {
                          label: "Up",
                          color: "hsl(var(--chart-2))",
                      }
                    : {
                          label: "Down",
                          color: "hsl(var(--chart-5))",
                      },
        }),
        [historicalPrice],
    );
};
