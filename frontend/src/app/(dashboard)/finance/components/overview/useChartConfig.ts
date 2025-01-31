import { useMemo } from "react";
import { HistoricalBankBalances } from "@/app/(dashboard)/finance/expense/components/transaction-table/types";

export const useChartConfig = (historicalData: HistoricalBankBalances) => {
    return useMemo(
        () => ({
            trend:
                Number(historicalData?.[historicalData.length - 1]?.balance) >=
                0
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
