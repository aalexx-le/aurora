-- Add MATERIALIZED VIEW for HistoricalAssetProfit with 3 time frame (5m, 1h, 1d)

-- 5 minutes
DROP MATERIALIZED VIEW IF EXISTS historical_asset_profit_5m;
CREATE MATERIALIZED VIEW historical_asset_profit_5m
            WITH (timescaledb.continuous) AS
SELECT time_bucket('5 minutes', hap.time) AS time,
       hap."assetInfoId",
       hap."cryptoPortfolioId",
       last(hap."estimatedProfit", hap.time) AS "estimatedProfit",
       last(hap."totalCostInQuoteQty", hap.time) AS "totalCostInQuoteQty",
       last(hap."remainingQty", hap.time) AS "remainingQty"
FROM "HistoricalAssetProfit" hap
GROUP BY time_bucket('5 minutes', hap.time), hap."assetInfoId", hap."cryptoPortfolioId"
ORDER BY time
WITH NO DATA;
ALTER MATERIALIZED VIEW historical_asset_profit_5m set (timescaledb.materialized_only = false);

-- 1 hour
DROP MATERIALIZED VIEW IF EXISTS historical_asset_profit_1h;
CREATE MATERIALIZED VIEW historical_asset_profit_1h
            WITH (timescaledb.continuous) AS
SELECT time_bucket('1 hour', hap.time) AS time,
       hap."assetInfoId",
       hap."cryptoPortfolioId",
       last(hap."estimatedProfit", hap.time) AS "estimatedProfit",
       last(hap."totalCostInQuoteQty", hap.time) AS "totalCostInQuoteQty",
       last(hap."remainingQty", hap.time) AS "remainingQty"
FROM "HistoricalAssetProfit" hap
GROUP BY time_bucket('1 hour', hap.time), hap."assetInfoId", hap."cryptoPortfolioId"
ORDER BY time
WITH NO DATA;
ALTER MATERIALIZED VIEW historical_asset_profit_1h set (timescaledb.materialized_only = false);

-- 1 day
DROP MATERIALIZED VIEW IF EXISTS historical_asset_profit_1d;
CREATE MATERIALIZED VIEW historical_asset_profit_1d
            WITH (timescaledb.continuous) AS
SELECT time_bucket('1 day', hap.time) AS time,
       hap."assetInfoId",
       hap."cryptoPortfolioId",
       last(hap."estimatedProfit", hap.time) AS "estimatedProfit",
       last(hap."totalCostInQuoteQty", hap.time) AS "totalCostInQuoteQty",
       last(hap."remainingQty", hap.time) AS "remainingQty"
FROM "HistoricalAssetProfit" hap
GROUP BY time_bucket('1 day', hap.time), hap."assetInfoId", hap."cryptoPortfolioId"
ORDER BY time
WITH NO DATA;
ALTER MATERIALIZED VIEW historical_asset_profit_1d set (timescaledb.materialized_only = false);