import { useMemo } from "react";
import { HistoricalCryptoBalance } from "@/app/(dashboard)/finance/investment/components/historical-balance-chart/types";

export const useChartConfig = (historicalData: HistoricalCryptoBalance[]) => {
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
