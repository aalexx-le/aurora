import { DatabaseEvent } from "./database.event";

export enum SubscriptionEvent {
    CRYPTO_PORTFOLIO_CREATION_STATUS = "crypto-portfolio-creation-status",

    ASSET_PRICE_1m_INSERTED = DatabaseEvent.ASSET_PRICE_1m_INSERT,
    ASSET_PRICE_5m_INSERTED = DatabaseEvent.ASSET_PRICE_5m_INSERT,

    HISTORICAL_CRYPTO_BALANCE_INSERTED = "historical-crypto-balance-inserted",

    HISTORICAL_ASSET_PROFIT_INSERTED = "historical-asset-profit-inserted",

    MEMBERSHIP_SUBSCRIPTION_UPDATED = "membership-subscription-updated",
}
