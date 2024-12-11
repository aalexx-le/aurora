import { useQuery } from "@apollo/client";
import {
    GetCryptoPortfoliosQuery,
    QueryGetCryptoPortfoliosArgs,
} from "@/gql/graphql";
import { GET_CRYPTO_PORTFOLIOS } from "@/api/script/crypto/crypto";
import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/state/hooks";
import { Convert } from "easy-currencies";

export const useTotalInvestmentBalance = () => {
    const { user } = useAppSelector((state) => state.auth.state);
    const { data, loading } = useQuery<
        GetCryptoPortfoliosQuery,
        QueryGetCryptoPortfoliosArgs
    >(GET_CRYPTO_PORTFOLIOS, {
        variables: { data: { userId: Number(user?.id) } },
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
