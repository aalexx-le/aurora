import { DatabaseEvent } from "./database.event";

export enum SubscriptionEvent {
    CRYPTO_PORTFOLIO_CREATED = "crypto-portfolio-created",
    ASSET_PRICE_1m_INSERTED = DatabaseEvent.ASSET_PRICE_1m_INSERT,
    ASSET_PRICE_5m_INSERTED = DatabaseEvent.ASSET_PRICE_5m_INSERT,
}
