import json
import logging
import sys
from datetime import datetime, timedelta, timezone
from typing import List
from uuid import uuid4

import okx.Account as OKXAccountClient
import okx.Trade as OKXTradeClient
import pytz
from airflow import DAG
from airflow.decorators import task
from binance.client import Client as BinanceClient
from graphql_client.enums import CEXExchanges
from mexc_api.spot import Spot as MexcClient
from psycopg import Connection
from psycopg.rows import class_row, dict_row
from sql.fetch_trades import INSERT_TRADE, GET_LATEST_TRADES
from sql.update_crypto_portfolio import GET_ASSET_SYMBOL
from tasks.get_cex_account import get_cex_account
from tasks.get_crypto_portfolio import get_crypto_portfolio
from tasks.get_latest_asset_profit import get_latest_asset_profits
from tasks.get_prices import (convert_to_asset_id_map, convert_to_price_map,
                             get_latest_price)
from tasks.index import TaskName
from tasks.update_asset_balances import update_asset_balances
from utils.connection import get_connection
from utils.data_model import (AccountBalances, CEXAccount, LatestTrade,
                              CryptoPortfolioForCalculation, LatestAssetPrice,
                              LatestAssetProfit, Trade)

sys.path.insert(0, "/root/airflow/dags/utils")

def create_trade(symbol_id, trade, current_portfolio) -> Trade:
    """Creates a single Trade object from a trade dictionary.

    Args:
        trade: A dictionary representing trade data.
        current_portfolio: The current crypto portfolio object (default: crypto_portfolio).

    Returns:
        A Trade object.
    """

    if not current_portfolio:
        raise ValueError("crypto_portfolio argument is required")

    return Trade(
        **trade,
        cryptoPortfolioId=current_portfolio.id,
        assetInfoId=symbol_id
    )

def create_trades(symbol_id: str, trades_data: list[dict], crypto_portfolio: CryptoPortfolioForCalculation) -> List[Trade]:
    """Creates a list of Trade objects from trade data.

    Args:
        trades_data: A list of dictionaries representing trade data.
        crypto_portfolio: An optional object representing the crypto portfolio
                           (default: None).

    Returns:
        A list of Trade objects.
    """

    # Use map with the inner lambda function
    return list(map(lambda trade: create_trade(symbol_id, trade, crypto_portfolio), trades_data))

def find_child_portfolio_and_account(crypto_portfolios: List[CryptoPortfolioForCalculation], accounts: List[CEXAccount], parent_id: int) -> dict:
    port_acc_map = {}
    
    for crypto_portfolio, account in zip(crypto_portfolios, accounts):
        if crypto_portfolio.parent_portfolio_id != parent_id:
            continue
        
        port_acc_map[crypto_portfolio.id] = {
            "portfolio": crypto_portfolio,
            "account": account
        }
        
    return port_acc_map

def find_all_owning_symbols(crypto_portfolio: CryptoPortfolioForCalculation, account: CEXAccount, asset_id_map: dict, conn: Connection) -> List[str]:
    symbols = []
    
    for owning_coin in account.balances:
        symbols.append(owning_coin.asset)
        
    if crypto_portfolio.latest_asset_profits is None:
        return symbols

    for owning_coin in crypto_portfolio.latest_asset_profits:
        if (owning_coin.remaining_qty - 0) < 0.00001:
            continue

        symbol = asset_id_map.get(owning_coin.asset_info_id)

        if symbol is None:
            with conn.cursor() as _cursor:
                _cursor.execute(GET_ASSET_SYMBOL, (owning_coin.asset_info_id,))
                asset_info = _cursor.fetchone()
                if asset_info is None:
                    continue
                symbol = asset_info[0]

        symbols.append(symbol)
        
    return list(set(symbols))


def get_trades_from_cex(crypto_portfolio: CryptoPortfolioForCalculation, latest_time: datetime, symbol: str, symbol_id: str):
    trades = []
    latest_timestamp_in_ms = int(latest_time.timestamp() * 1000) if latest_time else None
    
    try:
        if crypto_portfolio.exchanges == CEXExchanges.MEXC:
            mexc_client = MexcClient(crypto_portfolio.api_key, crypto_portfolio.secret_key)
            trades = mexc_client.account.get_trades(
                symbol=symbol + "USDT",
                start_ms=latest_timestamp_in_ms
            ) 
            
            trades = create_trades(
                symbol_id, 
                trades, 
                crypto_portfolio
            )
            
            
        elif crypto_portfolio.exchanges == CEXExchanges.OKX:
            okx_client = OKXTradeClient.TradeAPI(
                crypto_portfolio.api_key, 
                crypto_portfolio.secret_key, 
                crypto_portfolio.passphrase, 
                False, "0")
            # data = okx_client.get_orders_history(instId=symbol + "-USDT", instType="SPOT", state="filled")
            # raw_trades = data['data']
            
            # for trade in raw_trades:
            #     price = float(trade['avgPx'])
            #     qty = qty = float(trade['accFillSz'])
            #     quote_qty = price * qty
                
            #     trade = {
            #         "price": price,
            #         "qty": qty,
            #         "quoteQty": quote_qty,
            #         "commission": trade['fee'],
            #         "commissionAsset": trade['feeCcy'],
            #         "time": trade['fillTime'],
            #         "isBuyer": trade['side'] == "buy"
            #     }
            data = okx_client.get_fills(instId=symbol + "-USDT", instType="SPOT", begin=latest_timestamp_in_ms)
            raw_trades = data['data']
            for trade in raw_trades:
                price = float(trade['fillPx'])
                qty = float(trade['fillSz'])
                quote_qty = price * qty
                
                trade = {
                    "price": price,
                    "qty": qty,
                    "quoteQty": quote_qty,
                    "commission": trade['fee'],
                    "commissionAsset": trade['feeCcy'],
                    "time": trade['fillTime'],
                    "isBuyer": trade['side'] == "buy"
                }
                
                
                trade = create_trade(
                    symbol_id, 
                    trade, 
                    crypto_portfolio
                )
                
                trades.append(trade)
        elif crypto_portfolio.exchanges == CEXExchanges.BINANCE:   
            binance_client = BinanceClient(
                crypto_portfolio.api_key, 
                crypto_portfolio.secret_key
            )
            trades = binance_client.get_my_trades(
                symbol=symbol + "USDT",
                startTime=latest_timestamp_in_ms
            )
            # fd_trades = binance_client.get_my_trades(
            #     symbol=symbol + "FDUSD",
            # )

            trades = create_trades(
                symbol_id, 
                trades, 
                crypto_portfolio
            )
    except Exception as e:
        logging.error(e)
            
    return trades


def find_symbol_latest_trade(symbol_id, latest_trades: List[LatestTrade]) -> LatestTrade:
    trades = list(filter(lambda t: t.asset_info_id == symbol_id, latest_trades))
    
    latest_time = None
    latest_trade = None
    logging.info(trades)
    for trade in trades:
        if latest_time is None or trade.time > latest_time:
            latest_time = trade.time
            latest_trade = trade
    
    return latest_trade
    

@task(task_id="get_trades")
def get_trades(
    crypto_portfolios: List[CryptoPortfolioForCalculation],
    accounts: List[CEXAccount],
    **kwargs
):
    conn = get_connection()
    asset_id_map = kwargs["ti"].xcom_pull(task_ids=TaskName.CONVERT_TO_ASSET_ID_MAP)
    all_trades = []
    
    for crypto_portfolio, account in zip(crypto_portfolios, accounts):
        logging.info("Crypto Portfolio: " + crypto_portfolio.exchanges)
        
        symbols = []
        portfolio_trades = []
        
        # only fetch trades from `ALL` portfolios
        if crypto_portfolio.exchanges != CEXExchanges.ALL:
            continue
            
        port_acc_map = find_child_portfolio_and_account(crypto_portfolios, accounts, crypto_portfolio.id)
        latest_trades = []
        with conn.cursor(row_factory=class_row(LatestTrade)) as cursor:
            for port_acc in port_acc_map.values():
                cursor.execute(GET_LATEST_TRADES, (port_acc["portfolio"].id,))
                latest_trades.extend(cursor.fetchall())
                symbols.extend(find_all_owning_symbols(port_acc["portfolio"], port_acc["account"], asset_id_map, conn))
            
        symbols = list(set(symbols))
     
        for symbol in symbols:
            logging.info("Symbol: " + symbol)
            
            if symbol in ["USDT", "FDUSD"]:
                continue

            if symbol not in asset_id_map:
                continue

            symbol_id = asset_id_map[symbol]
            trades = []
            latest_trade = find_symbol_latest_trade(symbol_id, latest_trades)
            latest_time = latest_trade.time if latest_trade else None
        
            try:
                for port_acc in port_acc_map.values():
                    trades.extend(get_trades_from_cex(port_acc["portfolio"], latest_time, symbol, symbol_id))   
            except Exception as e:
                logging.error(e)
                continue
            
            logging.info(trades)
            portfolio_trades.extend(trades)
            
        all_trades.append(portfolio_trades)
        
    logging.info(all_trades)
        
    return all_trades


@task(task_id="insert_trades")
def insert_trades(port_trades: List[List[Trade]], **kwargs):
    conn = get_connection()
    with conn.cursor() as cursor:
        for trades in port_trades:
            for trade in trades:
                try:
                    logging.info(trade.model_dump())
                    cursor.execute(INSERT_TRADE, trade.model_dump())
                    conn.commit()
                except Exception as e:
                    logging.error(e)
                    conn.rollback()
                    continue
    

# Define default arguments
default_args = {
    "owner": "airflow",
    "start_date": datetime(2024, 10, 26, 1, 0, 0),  # Adjust start date as needed
    "retries": 1,
    "retry_delay": timedelta(minutes=1),
}

with DAG(
    dag_id="fetch_trades",
    default_args=default_args,
    max_active_runs=1,
    catchup=False,
    schedule=timedelta(minutes=1),
) as dag:
    # get portfolios from database
    crypto_portfolios = get_crypto_portfolio()
    
    new_crypto_portfolios = get_latest_asset_profits(crypto_portfolios)
    
    # get binance account
    accounts = get_cex_account(new_crypto_portfolios)
    
    # get latest prices from database
    latest_prices_list = get_latest_price()
    asset_id_map = convert_to_asset_id_map(latest_prices_list)
    
    trades = get_trades(new_crypto_portfolios, accounts)
    
    [latest_prices_list, asset_id_map] >> trades >> insert_trades(trades)
