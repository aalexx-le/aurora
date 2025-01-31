from sql.base import get_insert_sql_script, get_query_sql_script

INSERT_TRADE = get_insert_sql_script("Trade", ["cryptoPortfolioId", "assetInfoId", "price", "qty", "quoteQty", "commission", "commissionAsset", "time", "isBuyer"])

GET_LATEST_TRADES = '''
    SELECT  trade."assetInfoId" as asset_info_id,
            trade."cryptoPortfolioId" as crypto_portfolio_id,
            trade."time" as time
    FROM "Trade" trade
    INNER JOIN (
        SELECT t2."cryptoPortfolioId", t2."assetInfoId", MAX("time") AS "latest_time"
        FROM "Trade" t2
        GROUP BY t2."cryptoPortfolioId", t2."assetInfoId"
    ) latest_history ON trade."cryptoPortfolioId" = latest_history."cryptoPortfolioId"
                            AND trade."assetInfoId" = latest_history."assetInfoId"
                            AND trade."time" = latest_history."latest_time"
    WHERE trade."cryptoPortfolioId" = %s
    GROUP BY trade."assetInfoId", trade."cryptoPortfolioId", trade."time"
'''