import {
    GET_HISTORICAL_BALANCE,
    SUBSCRIBE_HISTORICAL_BALANCE,
} from "@/api/crypto/crypto";
import { HistoricalCryptoBalance } from "@/app/(dashboard)/finance/investment/components/historical-balance-chart/types";
import { useConvertCurrencyContext } from "@/lib/context/convert-currency.context";
import { TimeframeEnum } from "@/lib/utils/date-time/timeframe.enum";
import { useQuery, useSubscription } from "@apollo/client";
import { useEffect, useMemo, useState } from "react";

export const useHistoricalBalanceQuery = (
    cryptoPortfolioId: string,
    timeFrame: TimeframeEnum,
) => {
    const { data, loading } = useQuery(GET_HISTORICAL_BALANCE, {
        variables: {
            data: { cryptoPortfolioId, timeFrame },
            pagination: { take: 500 },
        },
    });
    const { data: newData } = useSubscription(SUBSCRIBE_HISTORICAL_BALANCE, {
        variables: {
            data: { cryptoPortfolioIds: [cryptoPortfolioId], timeFrame },
        },
    });

    const [convertedValues, setConvertedValues] = useState<
        HistoricalCryptoBalance[]
    >([]);
    const { convertCurrency } = useConvertCurrencyContext();

    const aggregateData = useMemo(() => {
        if (!data?.getHistoricalBalances || loading) {
            return [];
        }

        if (!newData?.newHistoricalCryptoBalance) {
            return data.getHistoricalBalances;
        }

        return [
            ...data.getHistoricalBalances,
            newData.newHistoricalCryptoBalance,
        ];
    }, [data, newData, loading]);

    useEffect(() => {
        const convert = async () => {
            const converted = await Promise.all(
                aggregateData.map((v) =>
                    convertCurrency(v.estimatedBalance as number, false),
                ),
            );
            setConvertedValues(
                aggregateData.map((v, i) => ({
                    ...v,
                    estimatedBalance: converted[i] as unknown as number,
                })),
            );
        };
        convert();
    }, [aggregateData, convertCurrency]);

    return convertedValues;
};
