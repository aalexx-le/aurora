(
  SELECT
    _materialized_hypertable_17."time",
    _materialized_hypertable_17."assetInfoId",
    _materialized_hypertable_17."cryptoPortfolioId",
    _materialized_hypertable_17."estimatedProfit",
    _materialized_hypertable_17."totalCostInQuoteQty",
    _materialized_hypertable_17."remainingQty"
  FROM
    _timescaledb_internal._materialized_hypertable_17
  WHERE
    (
      _materialized_hypertable_17."time" < COALESCE(
        _timescaledb_functions.to_timestamp_without_timezone(_timescaledb_functions.cagg_watermark(17)),
        '-infinity' :: timestamp without time zone
      )
    )
  ORDER BY
    _materialized_hypertable_17."time"
)
UNION
ALL (
  SELECT
    time_bucket('1 day' :: INTERVAL, hap."time") AS "time",
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
        _timescaledb_functions.to_timestamp_without_timezone(_timescaledb_functions.cagg_watermark(17)),
        '-infinity' :: timestamp without time zone
      )
    )
  GROUP BY
    (time_bucket('1 day' :: INTERVAL, hap."time")),
    hap."assetInfoId",
    hap."cryptoPortfolioId"
  ORDER BY
    (time_bucket('1 day' :: INTERVAL, hap."time"))
)
ORDER BY
  1;