-- Add MATERIALIZED VIEW for AssetPrice with 3 time frame (5m, 1h, 1d)

--  5 min
DROP MATERIALIZED VIEW IF EXISTS asset_price_5m;
CREATE MATERIALIZED VIEW asset_price_5m
            WITH (timescaledb.continuous) AS
SELECT time_bucket('5 min', ap.open_time) AS open_time,
       ap."assetInfoId",
       first(ap."openPrice", ap.open_time) AS "openPrice",
       last(ap."closePrice", ap.open_time) AS "closePrice",
       max(ap."highPrice") AS "highPrice",
       min(ap."lowPrice") AS "lowPrice",
       sum(ap."volume") AS "volume"
from "AssetPrice" ap
GROUP BY time_bucket('5 min', ap.open_time), ap."assetInfoId"
order by open_time
WITH NO DATA;
ALTER MATERIALIZED VIEW asset_price_5m set (timescaledb.materialized_only = false);


-- 1 hour
DROP MATERIALIZED VIEW IF EXISTS asset_price_1h;
CREATE MATERIALIZED VIEW asset_price_1h
            WITH (timescaledb.continuous) AS
SELECT time_bucket('1 hour', ap.open_time) AS open_time,
       ap."assetInfoId",
       first(ap."openPrice", ap.open_time) AS "openPrice",
       last(ap."closePrice", ap.open_time) AS "closePrice",
       max(ap."highPrice") AS "highPrice",
       min(ap."lowPrice") AS "lowPrice",
       sum(ap."volume") AS "volume"
from "AssetPrice" ap
GROUP BY time_bucket('1 hour', ap.open_time), ap."assetInfoId"
order by open_time
WITH NO DATA;
ALTER MATERIALIZED VIEW asset_price_1h set (timescaledb.materialized_only = false);


-- 1 day
DROP MATERIALIZED VIEW IF EXISTS asset_price_1d;
CREATE MATERIALIZED VIEW asset_price_1d
            WITH (timescaledb.continuous) AS
SELECT time_bucket('1 day', ap.open_time) AS open_time,
       ap."assetInfoId",
       first(ap."openPrice", ap.open_time) AS "openPrice",
       last(ap."closePrice", ap.open_time) AS "closePrice",
       max(ap."highPrice") AS "highPrice",
       min(ap."lowPrice") AS "lowPrice",
       sum(ap."volume") AS "volume"
from "AssetPrice" ap
GROUP BY time_bucket('1 day', ap.open_time), ap."assetInfoId"
order by open_time
WITH NO DATA;
ALTER MATERIALIZED VIEW asset_price_1d set (timescaledb.materialized_only = false);


