-- add trigger for historical asset balance insert event (1m, 1h)
CREATE OR REPLACE FUNCTION notify_historical_crypto_balance_inserted()
    RETURNS TRIGGER AS
$$
BEGIN
    PERFORM notify_historical_crypto_balance_1m_inserted(NEW);
    PERFORM notify_historical_crypto_balance_1h_inserted(NEW);
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 1 min notifier
CREATE OR REPLACE FUNCTION notify_historical_crypto_balance_1m_inserted(NEW "HistoricalCryptoBalance")
    RETURNS VOID AS
$$
BEGIN
    PERFORM pg_notify('historical-crypto-balance-1m-inserted', row_to_json(NEW)::text);
END;
$$ LANGUAGE plpgsql;

-- 1 hour notifier
CREATE OR REPLACE FUNCTION notify_historical_crypto_balance_1h_inserted(NEW "HistoricalCryptoBalance")
    RETURNS VOID AS
$$
DECLARE
latest_balance "historical_crypto_balance_1h";
BEGIN
SELECT *
INTO latest_balance
FROM "historical_crypto_balance_1h"
WHERE "cryptoPortfolioId" = NEW."cryptoPortfolioId"
ORDER BY time DESC
    LIMIT 1;

IF NEW.time = latest_balance.time THEN
        PERFORM pg_notify('historical-crypto-balance-1h-inserted', row_to_json(latest_balance)::text);
END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER historical_crypto_balance_inserted_trigger
    AFTER INSERT
    ON "HistoricalCryptoBalance"
    FOR EACH ROW
EXECUTE PROCEDURE notify_historical_crypto_balance_inserted();