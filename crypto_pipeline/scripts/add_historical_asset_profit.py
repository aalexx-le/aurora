from requests import Request, Session
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects
import json
import psycopg
from psycopg import sql
from uuid import uuid4
from binance.client import Client
import logging
from kafka import KafkaProducer
import pandas as pd
from datetime import datetime
import os
from typing import List, Optional
from pydantic import BaseModel, Field
from psycopg.rows import class_row, dict_row

api_key = "aKWDtpiXGp4NbnUMrH86DEgS2vpfqqchWT1L1ycq6fvF6KshYDP1wb89nIw7lt83"
secret_key = "iP8F1kfaEPqHgzJ03rL0HeXQhiFAl7UVEFwVJAXo0SqPPtbU7dBbg04H1eeWcKzg"


from urllib.parse import urlparse

database_url = "postgresql://postgre:abcd1234@localhost:5432/xela?schema=public"
logging.info("Connecting to " + database_url)
dbc = urlparse(database_url)

conn = psycopg.connect(
    f"dbname={dbc.path[1:]} user={dbc.username} password={dbc.password} host={dbc.hostname} port={dbc.port}"
)


def calculate_current_profit(df, current_price, symbol):
    """
    Calculates the current profit in USDT based on trade data
    and the current price of the asset, considering the price
    at which each trade was executed.

    Args:
        df: Pandas DataFrame with trade data, including columns:
        - isBuyer: Boolean indicating whether the party bought (True) or sold (False)
        - qty: Numeric value representing the quantity of the base asset (SUI)
        - quoteQty: Numeric value representing the quantity of the quote asset (USDT)
        - price: Numeric value representing the price at which the trade was executed
        current_price: The current price of the base asset (SUI).

    Returns:
        float: The current profit in USDT.
    """

    df["cost_usdt"] = df["quoteQty"]  # Initialize cost in USDT with quoteQty
    df.loc[df["isBuyer"] == False, "cost_usdt"] = -df[
        "cost_usdt"
    ]  # Negate cost for sell orders

    total_cost_usdt = df["cost_usdt"].sum()
    remaining_qty = (
        df[df["isBuyer"] == True]["qty"].sum() - df[df["isBuyer"] == False]["qty"].sum()
    )

    current_value_usdt = remaining_qty * current_price
    current_profit_usdt = current_value_usdt - total_cost_usdt

    return total_cost_usdt, remaining_qty, current_profit_usdt


GET_LATEST_PRICES = """
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
        ) latest_prices ON ap."assetInfoId" = latest_prices."assetInfoId" AND ap.open_time = latest_prices.latest_open_time
    JOIN "AssetInfo" ai on ai.id = ap."assetInfoId"
"""

GET_ALL_CRYPTO_PORTFOLIO = """
    SELECT  cp."id" as id,
            cp."updateTime" as update_time,
            cp."tradingType" as trading_type,
            cp."apiKey" as api_key,
            cp."secretKey" as secret_key,
    
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
"""

INSERT_SQL_SCRIPT = 'INSERT INTO {table} ({names}) VALUES ({fields})'

def get_insert_sql_script(table: str, fields: List[str]):
    return sql.SQL(INSERT_SQL_SCRIPT).format(
        table=sql.Identifier(table),
        names=sql.SQL(', ').join(map(sql.Identifier, fields)),
        fields=sql.SQL(', ').join(map(sql.Placeholder, fields))
    )
    

INSERT_HISTORICAL_ASSET_PROFIT = get_insert_sql_script(
    "HistoricalAssetProfit",
    ["time", "cryptoPortfolioId", "assetInfoId", "estimatedProfit", "totalCostInQuoteQty", "remainingQty"]
)


class CryptoPortfolioForCalculation(BaseModel):
    id: str
    update_time: Optional[datetime]
    trading_type: str
    api_key: str
    secret_key: str

    estimated_balance: Optional[float]
    change_percent: Optional[float]
    change_balance: Optional[float]


class LatestAssetPrice(BaseModel):
    asset_info_id: str
    open_price: float
    open_time: datetime
    symbol: str

asset_id_map = {}
latest_prices_map = {}
latest_time = datetime.now()

with conn.cursor(row_factory=class_row(LatestAssetPrice)) as cur:
    cur.execute(query=GET_LATEST_PRICES)
    latest_prices_list = cur.fetchall()

    latest_prices_map = {price.asset_info_id: price.open_price for price in latest_prices_list}

    asset_id_map = {price.symbol: price.asset_info_id for price in latest_prices_list}
    
    
    if len(latest_prices_list) > 0:
        if latest_prices_list[0].symbol == "USDT":
            latest_time = latest_prices_list[1].open_time
        else:
            latest_time = latest_prices_list[0].open_time

with conn.cursor(row_factory=class_row(CryptoPortfolioForCalculation)) as cursor:
    cursor.execute(GET_ALL_CRYPTO_PORTFOLIO)
    crypto_portfolios = cursor.fetchall()
    
    for crypto_portfolio in crypto_portfolios:
        binance_client = Client(crypto_portfolio.api_key, crypto_portfolio.secret_key)
        info = binance_client.get_account(recvWindow=60000, omitZeroBalances="true")
        balances = info["balances"]
        for owning_coin in balances:
            symbol = owning_coin["asset"]

            if symbol == "USDT":
                continue

            latest_price = latest_prices_map[asset_id_map[symbol]]

            date = datetime(2024, 1, 1)
            timestamp = datetime.timestamp(date)
            trades = binance_client.get_my_trades(
                symbol=symbol + "USDT", startTime=int(timestamp * 1000)
            )

            df = pd.DataFrame(trades)
            df["quoteQty"] = pd.to_numeric(df["quoteQty"])
            df["qty"] = pd.to_numeric(df["qty"])

            total_cost_usdt, remaining_qty, current_profit_usdt = calculate_current_profit(
                df, latest_price, symbol
            )
            
            data = {
                "cryptoPortfolioId": crypto_portfolio.id,
                "assetInfoId": asset_id_map[symbol],
                "time": latest_time,
                "estimatedProfit": current_profit_usdt,
                "totalCostInQuoteQty": total_cost_usdt,
                "remainingQty": remaining_qty,
            }
            
            cursor.execute(INSERT_HISTORICAL_ASSET_PROFIT, data)
        conn.commit()
            
            
            

# for owning_coin in balances:
#     symbol = owning_coin['asset']

#     date = datetime(2024, 1, 1)
#     timestamp = datetime.timestamp(date)
#     trades = binance_client.get_my_trades(symbol=symbol + "USDT", startTime=int(timestamp * 1000))

#     df = pd.DataFrame(trades)
#     df['quoteQty'] = pd.to_numeric(df['quoteQty'])
#     df['qty'] = pd.to_numeric(df['qty'])

#     profit_usdt = calculate_current_profit(df, 1)
