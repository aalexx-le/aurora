import { GET_CRYPTO_PORTFOLIOS } from "@/api/scripts/crypto/crypto";
import {
    GetCryptoPortfoliosQuery,
    GetCryptoPortfoliosQueryVariables,
} from "@/gql/graphql";
import { useQuery } from "@apollo/client";
import { Convert } from "easy-currencies";
import { useEffect, useMemo, useState } from "react";

export const useTotalInvestmentBalance = () => {
    const { data, loading } = useQuery<
        GetCryptoPortfoliosQuery,
        GetCryptoPortfoliosQueryVariables
    >(GET_CRYPTO_PORTFOLIOS, {
        variables: { timeFrame: "1 day" },
    });
    const totalBalance = useMemo(() => {
        const balances: number[] =
            data?.getCryptoPortfolios?.map(({ latestHistoricalBalances }) => {
                return latestHistoricalBalances.estimatedBalance;
            }) ?? [];

        return balances.reduce((acc, balance) => acc + balance, 0);
    }, [data]);
    const [convertedBalance, setConvertedBalance] = useState<number>(0);

    useEffect(() => {
        const convertCurrency = async (balance: number) => {
            return await Convert(balance).from("USD").to("VND");
        };
        convertCurrency(totalBalance).then((v) => {
            setConvertedBalance(v);
        });
    }, [totalBalance]);

    return convertedBalance;
};
