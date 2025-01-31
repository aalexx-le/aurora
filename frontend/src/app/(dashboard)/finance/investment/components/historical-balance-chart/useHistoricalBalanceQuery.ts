import { useQuery } from "@apollo/client";
import {
    GetHistoricalBalancesQuery,
    GetHistoricalBalancesQueryVariables,
} from "@/gql/graphql";
import {
    GET_HISTORICAL_BALANCE,
    getSubscriptNewHistoricalBalanceHook,
    getSubscriptNewHistoricalBalanceResult,
} from "@/api/script/crypto/crypto";
import { useEffect, useMemo, useState } from "react";
import { HistoricalCryptoBalance } from "@/app/(dashboard)/finance/investment/components/historical-balance-chart/types";
import { useConvertCurrencyContext } from "@/lib/context/convert-currency.context";
import { TimeframeEnum } from "@/lib/utils/date-time/timeframe.enum";

export const useHistoricalBalanceQuery = (
    cryptoPortfolioId: string,
    timeFrame: TimeframeEnum,
) => {
    const { data, loading, refetch } = useQuery<
        GetHistoricalBalancesQuery,
        GetHistoricalBalancesQueryVariables
    >(GET_HISTORICAL_BALANCE, {
        variables: {
            data: { cryptoPortfolioId, timeFrame },
            pagination: { take: 500 },
        },
    });
    const { hook, query } = getSubscriptNewHistoricalBalanceHook(timeFrame);
    const { data: newData } = hook(query, {
        variables: {
            data: { cryptoPortfolioIds: [cryptoPortfolioId], timeFrame },
        },
    });
    const newBalance = getSubscriptNewHistoricalBalanceResult(newData);

    const [convertedValues, setConvertedValues] = useState<
        HistoricalCryptoBalance[]
    >([]);
    const { convertCurrency } = useConvertCurrencyContext();

    const aggregateData = useMemo(() => {
        if (!data || loading) {
            return [];
        }

        return newBalance
            ? [...data.getHistoricalBalances, newBalance]
            : data.getHistoricalBalances;
    }, [data, newBalance, loading]);

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
