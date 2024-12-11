import { HistoricalAssetProfit } from "@/app/(dashboard)/finance/investment/types";
import { useMemo } from "react";

export const useChartConfig = (historicalData: HistoricalAssetProfit[]) => {
    return useMemo(
        () => ({
            trend:
                historicalData[historicalData.length - 1]?.estimatedProfit >= 0
                    ? {
                          label: "Up",
                          color: "hsl(var(--chart-2))",
                      }
                    : {
                          label: "Down",
                          color: "hsl(var(--chart-5))",
                      },
            zero: {
                label: "Zero",
                color: "hsl(var(--foreground))",
            },
            up: {
                label: "Up",
                color: "hsl(var(--chart-2))",
            },
            down: {
                label: "Down",
                color: "hsl(var(--chart-5))",
            },
        }),
        [historicalData],
    );
};
