(
  SELECT
    _materialized_hypertable_7."time",
    _materialized_hypertable_7."estimatedBalance",
    _materialized_hypertable_7."changeBalance",
    _materialized_hypertable_7."changePercent",
    _materialized_hypertable_7."cryptoPortfolioId"
  FROM
    _timescaledb_internal._materialized_hypertable_7
  WHERE
    (
      _materialized_hypertable_7."time" < COALESCE(
        _timescaledb_functions.to_timestamp_without_timezone(_timescaledb_functions.cagg_watermark(7)),
        '-infinity' :: timestamp without time zone
      )
    )
  ORDER BY
    _materialized_hypertable_7."time"
)
UNION
ALL (
  SELECT
    time_bucket('01:00:00' :: INTERVAL, hcb."time") AS "time",
    last(hcb."estimatedBalance", hcb."time") AS "estimatedBalance",
    last(hcb."changeBalance", hcb."time") AS "changeBalance",
    last(hcb."changePercent", hcb."time") AS "changePercent",
    hcb."cryptoPortfolioId"
  FROM
    "HistoricalCryptoBalance" hcb
  WHERE
    (
      hcb."time" >= COALESCE(
        _timescaledb_functions.to_timestamp_without_timezone(_timescaledb_functions.cagg_watermark(7)),
        '-infinity' :: timestamp without time zone
      )
    )
  GROUP BY
    (time_bucket('01:00:00' :: INTERVAL, hcb."time")),
    hcb."cryptoPortfolioId"
  ORDER BY
    (time_bucket('01:00:00' :: INTERVAL, hcb."time"))
)
ORDER BY
  1;