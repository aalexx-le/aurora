(
  SELECT
    _materialized_hypertable_10."time",
    _materialized_hypertable_10."estimatedBalance",
    _materialized_hypertable_10."changeBalance",
    _materialized_hypertable_10."changePercent",
    _materialized_hypertable_10."cryptoPortfolioId"
  FROM
    _timescaledb_internal._materialized_hypertable_10
  WHERE
    (
      _materialized_hypertable_10."time" < COALESCE(
        _timescaledb_functions.to_timestamp_without_timezone(_timescaledb_functions.cagg_watermark(10)),
        '-infinity' :: timestamp without time zone
      )
    )
  ORDER BY
    _materialized_hypertable_10."time"
)
UNION
ALL (
  SELECT
    time_bucket('01:00:00' :: INTERVAL, hcb."time") AS "time",
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
        _timescaledb_functions.to_timestamp_without_timezone(_timescaledb_functions.cagg_watermark(10)),
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