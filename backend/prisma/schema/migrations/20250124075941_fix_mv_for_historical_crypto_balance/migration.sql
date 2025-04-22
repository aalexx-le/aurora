-- Fix MATERIALIZED VIEW for Historical Crypto Balance with 2 time frame (1h, 1d)

-- 1 hour
DROP MATERIALIZED VIEW IF EXISTS historical_crypto_balance_1h;
CREATE MATERIALIZED VIEW historical_crypto_balance_1h
            WITH (timescaledb.continuous) AS
SELECT time_bucket('1 hour', hcb."time")                                                AS time,
       last(hcb."estimatedBalance", hcb.time)                                           AS "estimatedBalance",
       last(hcb."estimatedBalance", hcb.time) - first(hcb."estimatedBalance", hcb.time) AS "changeBalance",
       (last(hcb."estimatedBalance", hcb.time) - first(hcb."estimatedBalance", hcb.time)) /
       (first(hcb."estimatedBalance", hcb.time) + 0.000001) * 100                                    AS "changePercent",
       hcb."cryptoPortfolioId"                                                          AS "cryptoPortfolioId"
FROM "HistoricalCryptoBalance" hcb
GROUP BY time_bucket('1 hour', hcb."time"), hcb."cryptoPortfolioId"
ORDER BY time
WITH NO DATA;
ALTER MATERIALIZED VIEW historical_crypto_balance_1h set (timescaledb.materialized_only = false);


-- 1 day
DROP MATERIALIZED VIEW IF EXISTS historical_crypto_balance_1d;
CREATE MATERIALIZED VIEW historical_crypto_balance_1d
            WITH (timescaledb.continuous) AS
SELECT time_bucket('1 day', hcb."time")                                                AS time,
       last(hcb."estimatedBalance", hcb.time)                                           AS "estimatedBalance",
       last(hcb."estimatedBalance", hcb.time) - first(hcb."estimatedBalance", hcb.time) AS "changeBalance",
       (last(hcb."estimatedBalance", hcb.time) - first(hcb."estimatedBalance", hcb.time)) /
       (first(hcb."estimatedBalance", hcb.time) + 0.000001) * 100                                    AS "changePercent",
       hcb."cryptoPortfolioId"                                                          AS "cryptoPortfolioId"
FROM "HistoricalCryptoBalance" hcb
GROUP BY time_bucket('1 day', hcb."time"), hcb."cryptoPortfolioId"
ORDER BY time
WITH NO DATA;
ALTER MATERIALIZED VIEW historical_crypto_balance_1d set (timescaledb.materialized_only = false);