from sql.base import get_insert_sql_script, get_query_sql_script

GET_EARLIEST_TIME = """
    SELECT ap."assetInfoId",
           ap.open_time
    FROM "AssetPrice" ap
            INNER JOIN (SELECT "assetInfoId",
                                MIN(open_time) AS earliest_open_time
                        FROM "AssetPrice"
                        GROUP BY "assetInfoId") earliest_prices
                        ON ap."assetInfoId" = earliest_prices."assetInfoId" AND ap.open_time = earliest_prices.earliest_open_time
            JOIN "AssetInfo" ai on ai.id = ap."assetInfoId"
    WHERE ai."symbol" = %s
"""

GET_ASSET_INFO_BY_SYMBOL = get_query_sql_script('AssetInfo', ['id'], 'symbol')

INSERT_ASSET_PRICE_SQL = get_insert_sql_script('AssetPrice', ['assetInfoId', 'interval', 'open_time', 'close_time', 'openPrice', 'closePrice', 'highPrice', 'lowPrice', 'volume']) 