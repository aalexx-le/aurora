import gql from "graphql-tag";

export const GET_TRADES = gql`
    query GetTrades($data: GetTradeInput!) {
        getTrades(data: $data) {
            cryptoPortfolio {
                id
                name
                exchanges
            }
            time
            price
            qty
            quoteQty
            commission
            commissionAsset
            isBuyer
        }
    }
`;
