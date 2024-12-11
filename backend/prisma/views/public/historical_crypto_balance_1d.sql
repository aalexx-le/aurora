(
  SELECT
    _materialized_hypertable_11."time",
    _materialized_hypertable_11."estimatedBalance",
    _materialized_hypertable_11."changeBalance",
    _materialized_hypertable_11."changePercent",
    _materialized_hypertable_11."cryptoPortfolioId"
  FROM
    _timescaledb_internal._materialized_hypertable_11
  WHERE
    (
      _materialized_hypertable_11."time" < COALESCE(
        _timescaledb_functions.to_timestamp_without_timezone(_timescaledb_functions.cagg_watermark(11)),
        '-infinity' :: timestamp without time zone
      )
    )
  ORDER BY
    _materialized_hypertable_11."time"
)
UNION
ALL (
  SELECT
    time_bucket('1 day' :: INTERVAL, hcb."time") AS "time",
    last(hcb."estimatedBalance", hcb."time") AS "estimatedBalance",
    (
      last(hcb."estimatedBalance", hcb."time") - FIRST(hcb."estimatedBalance", hcb."time")
    ) AS "changeBalance",
    (
      (
        (
          last(hcb."estimatedBalance", hcb."time") - FIRST(hcb."estimatedBalance", hcb."time")
        ) / FIRST(hcb."estimatedBalance", hcb."time")
      ) * (100) :: double precision
    ) AS "changePercent",
    hcb."cryptoPortfolioId"
  FROM
    "HistoricalCryptoBalance" hcb
  WHERE
    (
      hcb."time" >= COALESCE(
        _timescaledb_functions.to_timestamp_without_timezone(_timescaledb_functions.cagg_watermark(11)),
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