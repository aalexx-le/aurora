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
from psycopg.rows import class_row, dict_row
from sql.update_crypto_portfolio import INSERT_HISTORICAL_ASSET_PROFIT, GET_ASSET_SYMBOL
from tasks.index import TaskName
from utils.calculation import (calc_change_in_balance, calc_estimated_balance,
                               calculate_all_time_profit)
from utils.connection import get_connection
from utils.data_model import (AccountBalances, CEXAccount,
                              CryptoPortfolioForCalculation, LatestAssetPrice,
                              LatestAssetProfit)
from psycopg import Connection


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

def filter_trades(trades, symbol_id):
    return list(filter(lambda t: t.assetInfoId == symbol_id, trades))

        
@task(task_id=TaskName.ADD_HISTORICAL_ASSET_PROFITS)
def add_historical_asset_profit(
    crypto_portfolios: List[CryptoPortfolioForCalculation],
    accounts: List[CEXAccount],
    **kwargs
):
    conn = get_connection()
    latest_prices_map = kwargs["ti"].xcom_pull(task_ids=TaskName.CONVERT_TO_PRICE_MAP)
    asset_id_map = kwargs["ti"].xcom_pull(task_ids=TaskName.CONVERT_TO_ASSET_ID_MAP)
    latest_time: datetime = kwargs["ti"].xcom_pull(task_ids=TaskName.GET_LATEST_TIME)

    with conn.cursor(row_factory=class_row(LatestAssetProfit)) as cursor:
        for crypto_portfolio, account in zip(crypto_portfolios, accounts):
            logging.info("Crypto Portfolio: " + crypto_portfolio.exchanges)
            
            symbols = []
            port_acc_map = {}
            if crypto_portfolio.exchanges == CEXExchanges.ALL:
                port_acc_map = find_child_portfolio_and_account(crypto_portfolios, accounts, crypto_portfolio.id)
                
                for port_acc in port_acc_map.values():
                    symbols.extend(find_all_owning_symbols(port_acc["portfolio"], port_acc["account"], asset_id_map, conn))
                    
                symbols = list(set(symbols))
                
            else:
                symbols = find_all_owning_symbols(crypto_portfolio, account, asset_id_map, conn)
                
                
            for symbol in symbols:
                logging.info("Symbol: " + symbol)

                if symbol in ["USDT", "FDUSD"]:
                    continue

                if symbol not in asset_id_map:
                    continue

                symbol_id = asset_id_map[symbol]

                # if symbol currently do not have price (launchpad token)
                if symbol_id not in latest_prices_map:
                    continue
                
                logging.info("Symbol ID: " + str(symbol_id))

                latest_price = latest_prices_map[asset_id_map[symbol]]
                latest_asset_profit = next((p for p in crypto_portfolio.latest_asset_profits if p.asset_info_id == asset_id_map[symbol]), None)
                
                if latest_asset_profit is None:
                    # fetch all trades
                    date = datetime(2024, 1, 1)
                    latest_timestamp = datetime.timestamp(date)
                    
                    latest_asset_profit = LatestAssetProfit(
                        time=latest_timestamp,
                        asset_info_id=asset_id_map[symbol],
                        estimated_profit=0,
                        total_cost_in_quote_qty=0,
                        remaining_qty=-1
                    )
                
                logging.info(latest_asset_profit)    
                if latest_asset_profit.remaining_qty == 0:
                    continue
                    
                # latest_timestamp = datetime.timestamp(latest_asset_profit.time)
                    
                trades = []
                
                if crypto_portfolio.exchanges != CEXExchanges.ALL:
                    trades = filter_trades(crypto_portfolio.trades, symbol_id)
                else:
                    for port_acc in port_acc_map.values():
                        trades.extend(filter_trades(port_acc["portfolio"].trades, symbol_id))
                        
                # logging.info("Symbol: " + symbol)
                # logging.info("timestamp: " + str(latest_asset_profit.time))
                # logging.info(trades)

                total_cost_usdt, remaining_qty, _current_profit_usdt = calculate_all_time_profit(
                    trades, latest_price
                )

                new_total_cost_usdt = total_cost_usdt

                new_remaining_qty = remaining_qty

                new_current_profit_usdt = _current_profit_usdt

                data = {
                    "cryptoPortfolioId": crypto_portfolio.id,
                    "assetInfoId": asset_id_map[symbol],
                    "time": latest_time,
                    "estimatedProfit": new_current_profit_usdt,
                    "totalCostInQuoteQty": new_total_cost_usdt,
                    "remainingQty": new_remaining_qty,
                }
                
                logging.info(data)

                cursor.execute(INSERT_HISTORICAL_ASSET_PROFIT, data)

                conn.commit()