import { CexExchanges } from "@/gql/graphql";

export const CRYPTO_EXCHANGES_INFOS = [
    {
        id: CexExchanges.Binance,
        name: "Binance",
        logo: "https://user-images.githubusercontent.com/12424618/54043975-b6cdb800-4182-11e9-83bd-0cd2eb757c6e.png"
    },
    {
        id: CexExchanges.Mexc,
        name: "MEXC",
        logo: "https://altcoinsbox.com/wp-content/uploads/2023/01/mexc-logo.png"
    },
    {
        id: CexExchanges.Okx,
        name: "OKX",
        logo: "https://altcoinsbox.com/wp-content/uploads/2023/03/okx-logo.jpg"
    },
    {
        id: CexExchanges.All,
        name: "All",
        logo: "/logo/logo-white.svg"
    },
] as const;

export type CryptoExchangeInfo = typeof CRYPTO_EXCHANGES_INFOS[number]; 