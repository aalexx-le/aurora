SELECT
    ai.symbol,
    ap."assetInfoId",
    ap."openPrice",
    ap."open_time"
FROM
    "AssetPrice" ap
        INNER JOIN (
        SELECT
            "assetInfoId",
            MAX(open_time) AS latest_open_time
        FROM
            "AssetPrice"
        GROUP BY
            "assetInfoId"
    ) latest_prices ON ap."assetInfoId" = latest_prices."assetInfoId" AND ap.open_time = latest_prices.latest_open_time
        JOIN "AssetInfo" ai on ai.id = ap."assetInfoId"