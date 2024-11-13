-- Add MATERIALIZED VIEW for AssetPrice with 3 time frame (1M)

-- 1 month
DROP MATERIALIZED VIEW IF EXISTS "asset_price_1M";
CREATE MATERIALIZED VIEW "asset_price_1M"
            WITH (timescaledb.continuous) AS
SELECT time_bucket('1 month', ap.open_time) AS open_time,
       ap."assetInfoId",
    first(ap."openPrice", ap.open_time) AS "openPrice",
    last(ap."closePrice", ap.open_time) AS "closePrice",
    max(ap."highPrice") AS "highPrice",
    min(ap."lowPrice") AS "lowPrice",
    sum(ap."volume") AS "volume"
from "AssetPrice" ap
GROUP BY time_bucket('1 month', ap.open_time), ap."assetInfoId"
order by open_time
WITH NO DATA;
ALTER MATERIALIZED VIEW "asset_price_1M" set (timescaledb.materialized_only = false);



-- Add MATERIALIZED VIEW for Historical Crypto Balance with 3 time frame (1h, 1d)

-- 1 hour
DROP MATERIALIZED VIEW IF EXISTS historical_crypto_balance_1h;
CREATE MATERIALIZED VIEW historical_crypto_balance_1h
            WITH (timescaledb.continuous) AS
SELECT time_bucket('1 hour', hcb."time") AS time,
       last(hcb."estimatedBalance", hcb.time) AS "estimatedBalance",
       last(hcb."changeBalance", hcb.time) AS "changeBalance",
       last(hcb."changePercent", hcb.time) AS "changePercent",
       hcb."cryptoPortfolioId" AS "cryptoPortfolioId"
FROM "HistoricalCryptoBalance" hcb
GROUP BY time_bucket('1 hour', hcb."time"), hcb."cryptoPortfolioId"
ORDER BY time
WITH NO DATA;
ALTER MATERIALIZED VIEW historical_crypto_balance_1h set (timescaledb.materialized_only = false);


-- 1 day
DROP MATERIALIZED VIEW IF EXISTS historical_crypto_balance_1d;
CREATE MATERIALIZED VIEW historical_crypto_balance_1d
            WITH (timescaledb.continuous) AS
SELECT time_bucket('1 day', hcb."time") AS time,
    last(hcb."estimatedBalance", hcb.time) AS "estimatedBalance",
    last(hcb."changeBalance", hcb.time) AS "changeBalance",
    last(hcb."changePercent", hcb.time) AS "changePercent",
    hcb."cryptoPortfolioId" AS "cryptoPortfolioId"
FROM "HistoricalCryptoBalance" hcb
GROUP BY time_bucket('1 day', hcb."time"), hcb."cryptoPortfolioId"
ORDER BY time
WITH NO DATA;
ALTER MATERIALIZED VIEW historical_crypto_balance_1d set (timescaledb.materialized_only = false);