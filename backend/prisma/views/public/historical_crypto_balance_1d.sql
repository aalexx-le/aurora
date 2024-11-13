(
  SELECT
    _materialized_hypertable_8."time",
    _materialized_hypertable_8."estimatedBalance",
    _materialized_hypertable_8."changeBalance",
    _materialized_hypertable_8."changePercent",
    _materialized_hypertable_8."cryptoPortfolioId"
  FROM
    _timescaledb_internal._materialized_hypertable_8
  WHERE
    (
      _materialized_hypertable_8."time" < COALESCE(
        _timescaledb_functions.to_timestamp_without_timezone(_timescaledb_functions.cagg_watermark(8)),
        '-infinity' :: timestamp without time zone
      )
    )
  ORDER BY
    _materialized_hypertable_8."time"
)
UNION
ALL (
  SELECT
    time_bucket('1 day' :: INTERVAL, hcb."time") AS "time",
    last(hcb."estimatedBalance", hcb."time") AS "estimatedBalance",
    last(hcb."changeBalance", hcb."time") AS "changeBalance",
    last(hcb."changePercent", hcb."time") AS "changePercent",
    hcb."cryptoPortfolioId"
  FROM
    "HistoricalCryptoBalance" hcb
  WHERE
    (
      hcb."time" >= COALESCE(
        _timescaledb_functions.to_timestamp_without_timezone(_timescaledb_functions.cagg_watermark(8)),
        '-infinity' :: timestamp without time zone
      )
    )
  GROUP BY
    (time_bucket('1 day' :: INTERVAL, hcb."time")),
    hcb."cryptoPortfolioId"
  ORDER BY
    (time_bucket('1 day' :: INTERVAL, hcb."time"))
)
ORDER BY
  1;