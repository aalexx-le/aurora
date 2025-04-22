(
  SELECT
    _materialized_hypertable_15."time",
    _materialized_hypertable_15."assetInfoId",
    _materialized_hypertable_15."cryptoPortfolioId",
    _materialized_hypertable_15."estimatedProfit",
    _materialized_hypertable_15."totalCostInQuoteQty",
    _materialized_hypertable_15."remainingQty"
  FROM
    _timescaledb_internal._materialized_hypertable_15
  WHERE
    (
      _materialized_hypertable_15."time" < COALESCE(
        _timescaledb_functions.to_timestamp_without_timezone(_timescaledb_functions.cagg_watermark(15)),
        '-infinity' :: timestamp without time zone
      )
    )
  ORDER BY
    _materialized_hypertable_15."time"
)
UNION
ALL (
  SELECT
    time_bucket('00:05:00' :: INTERVAL, hap."time") AS "time",
    hap."assetInfoId",
    hap."cryptoPortfolioId",
    last(hap."estimatedProfit", hap."time") AS "estimatedProfit",
    last(hap."totalCostInQuoteQty", hap."time") AS "totalCostInQuoteQty",
    last(hap."remainingQty", hap."time") AS "remainingQty"
  FROM
    "HistoricalAssetProfit" hap
  WHERE
    (
      hap."time" >= COALESCE(
        _timescaledb_functions.to_timestamp_without_timezone(_timescaledb_functions.cagg_watermark(15)),
        '-infinity' :: timestamp without time zone
      )
    )
  GROUP BY
    (time_bucket('00:05:00' :: INTERVAL, hap."time")),
    hap."assetInfoId",
    hap."cryptoPortfolioId"
  ORDER BY
    (time_bucket('00:05:00' :: INTERVAL, hap."time"))
)
ORDER BY
  1;