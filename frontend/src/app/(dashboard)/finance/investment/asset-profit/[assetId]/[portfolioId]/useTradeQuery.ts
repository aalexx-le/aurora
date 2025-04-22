import { GET_TRADES } from "@/api/scripts/crypto/trade";
import { GetTradesQuery, GetTradesQueryVariables } from "@/gql/graphql";
import { useQuery } from "@apollo/client";

export const useTradeQuery = (
    cryptoPortfolioId: string,
    assetInfoId: string,
) => {
    const { data } = useQuery<GetTradesQuery, GetTradesQueryVariables>(
        GET_TRADES,
        {
            variables: {
                data: {
                    // cryptoPortfolioId,
                    assetInfoId,
                },
            },
        },
    );

    const trades = (data?.getTrades || []).map((trade) => {
        const sign = trade.isBuyer ? 1 : -1;
        return {
            ...trade,
            qty: sign * trade.qty,
            quoteQty: sign * trade.quoteQty,
        };
    });
    // .filter(trade => trade.cryptoPortfolio.exchanges === CexExchanges.Okx);

    return trades;
};
