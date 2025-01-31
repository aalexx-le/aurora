from sql.base import get_insert_sql_script, get_query_sql_script

GET_ALL_CRYPTO_PORTFOLIO = '''
    SELECT  cp."id" as id,
            cp."parentPortfolioId" as parent_portfolio_id,
            cp."updateTime" as update_time,
            cp.exchanges as exchanges,
            cp."apiKey" as api_key,
            cp."secretKey" as secret_key,
            okxcp."passphrase" as passphrase,
            cp."tradingType" as trading_type,
            hpnl."estimatedBalance" as estimated_balance,
            hpnl."changeBalance" as change_balance,
            hpnl."changePercent" as change_percent
    FROM "HistoricalCryptoBalance" hpnl
    INNER JOIN (SELECT "cryptoPortfolioId",
                        MAX("time") as "latest_time"
                FROM "HistoricalCryptoBalance"
                GROUP BY "cryptoPortfolioId") latest_history_pnl
                ON hpnl."cryptoPortfolioId" = latest_history_pnl."cryptoPortfolioId" AND
                hpnl.time = latest_history_pnl."latest_time"
    RIGHT JOIN "CryptoPortfolio" cp on cp."id" = hpnl."cryptoPortfolioId"
    LEFT JOIN "OKXCryptoPortfolio" okxcp on okxcp."cryptoPortfolioId" = cp."id"
'''

GET_OKX_PORTFOLIO = '''
    select passphrase
    from "OKXCryptoPortfolio"
    where "cryptoPortfolioId" = %s;
'''

GET_LATEST_PRICES = '''
    SELECT
        ai."symbol",
        ap."assetInfoId" as asset_info_id,
        ap."openPrice" as open_price,
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
        ) latest_prices ON ap."assetInfoId" = latest_prices."assetInfoId" 
                                AND ap.open_time = latest_prices.latest_open_time
    JOIN "AssetInfo" ai on ai.id = ap."assetInfoId"
'''

GET_LATEST_ASSET_PROFITS = '''
    SELECT 
        hap."assetInfoId" as asset_info_id,
        hap."estimatedProfit" as estimated_profit,
        hap."totalCostInQuoteQty" as total_cost_in_quote_qty,
        hap."remainingQty" as remaining_qty
    FROM "HistoricalAssetProfit" hap
    INNER JOIN (
        SELECT "cryptoPortfolioId", MAX("time") AS "latest_time"
        FROM "HistoricalAssetProfit"
        GROUP BY "cryptoPortfolioId"
    ) latest_history ON hap."cryptoPortfolioId" = latest_history."cryptoPortfolioId"
                            AND hap."time" = latest_history."latest_time"
    WHERE hap."cryptoPortfolioId" = %s
'''

GET_TRADES = '''
    SELECT 
        "assetInfoId",
        "cryptoPortfolioId",
        "price",
        "qty",
        "quoteQty",
        "commission",
        "commissionAsset",
        "time",
        "isBuyer"
    FROM "Trade"
    WHERE "cryptoPortfolioId" = %s
'''

GET_ONE_ASSET_INFO = get_query_sql_script(
    "AssetInfo",
    ["id"],
    "symbol"
)

DELETE_ASSET_BALANCES = '''
    DELETE FROM "AssetBalance" WHERE "cryptoPortfolioId" = %s
'''

UPDATE_CRYPTO_PROFILE_UPDATE_TIME = '''
    UPDATE "CryptoPortfolio"
    SET "updateTime" = %s
    WHERE "id" = %s
'''

INSERT_ASSET_BALANCE = get_insert_sql_script(
    "AssetBalance",
    ["id", "cryptoPortfolioId", "assetInfoId", "balance", "locked"]
)

INSERT_HISTORICAL_BALANCE = get_insert_sql_script(
    "HistoricalCryptoBalance", 
    ["cryptoPortfolioId", "time", "estimatedBalance", "changePercent", "changeBalance"]
)

GET_LATEST_ASSET_PROFITS = '''
    SELECT
        hap."time" as time,
        hap."assetInfoId" as asset_info_id,
        ai.symbol,
        hap."estimatedProfit" as estimated_profit,
        hap."totalCostInQuoteQty" as total_cost_in_quote_qty,
        hap."remainingQty" as remaining_qty
    FROM "HistoricalAssetProfit" hap
    JOIN "AssetInfo" ai on ai.id = hap."assetInfoId"
    INNER JOIN (
        SELECT "cryptoPortfolioId", "assetInfoId", MAX("time") AS "latest_time"
        FROM "HistoricalAssetProfit"
        GROUP BY "cryptoPortfolioId", "assetInfoId"
    ) latest_history ON hap."cryptoPortfolioId" = latest_history."cryptoPortfolioId"
                            AND hap."assetInfoId" = latest_history."assetInfoId"
                            AND hap."time" = latest_history."latest_time"
    WHERE hap."cryptoPortfolioId" = %s
'''

GET_ASSET_SYMBOL = get_query_sql_script(
    "AssetInfo",
    ["symbol"],
    "id"
)

INSERT_HISTORICAL_ASSET_PROFIT = get_insert_sql_script(
    "HistoricalAssetProfit",
    ["time", "cryptoPortfolioId", "assetInfoId", "estimatedProfit", "totalCostInQuoteQty", "remainingQty"]
)