(
  SELECT
    _materialized_hypertable_16."time",
    _materialized_hypertable_16."assetInfoId",
    _materialized_hypertable_16."cryptoPortfolioId",
    _materialized_hypertable_16."estimatedProfit",
    _materialized_hypertable_16."totalCostInQuoteQty",
    _materialized_hypertable_16."remainingQty"
  FROM
    _timescaledb_internal._materialized_hypertable_16
  WHERE
    (
      _materialized_hypertable_16."time" < COALESCE(
        _timescaledb_functions.to_timestamp_without_timezone(_timescaledb_functions.cagg_watermark(16)),
        '-infinity' :: timestamp without time zone
      )
    )
  ORDER BY
    _materialized_hypertable_16."time"
)
UNION
ALL (
  SELECT
    time_bucket('01:00:00' :: INTERVAL, hap."time") AS "time",
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
        _timescaledb_functions.to_timestamp_without_timezone(_timescaledb_functions.cagg_watermark(16)),
        '-infinity' :: timestamp without time zone
      )
    )
  GROUP BY
    (time_bucket('01:00:00' :: INTERVAL, hap."time")),
    hap."assetInfoId",
    hap."cryptoPortfolioId"
  ORDER BY
    (time_bucket('01:00:00' :: INTERVAL, hap."time"))
)
ORDER BY
  1;