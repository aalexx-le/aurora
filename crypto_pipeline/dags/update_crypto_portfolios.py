import json
import logging
import sys
from datetime import datetime, timedelta, timezone
from typing import List
from uuid import uuid4

import pytz
from airflow import DAG
from airflow.decorators import task
from binance.client import Client as BinanceClient
from mexc_api.spot import Spot as MexcClient
import okx.Account as OKXAccountClient
import okx.Trade as OKXTradeClient
from psycopg.rows import class_row, dict_row
from sql.update_crypto_portfolio import (
    DELETE_ASSET_BALANCES,
    GET_ALL_CRYPTO_PORTFOLIO,
    GET_LATEST_PRICES,
    GET_ONE_ASSET_INFO,
    INSERT_ASSET_BALANCE,
    INSERT_HISTORICAL_BALANCE,
    UPDATE_CRYPTO_PROFILE_UPDATE_TIME,
    GET_LATEST_ASSET_PROFITS,
    INSERT_HISTORICAL_ASSET_PROFIT,
    GET_ASSET_SYMBOL
)
from tasks.insert_asset_infos import (
    fetch_symbol_infos,
    insert_asset_infos,
)
from tasks.insert_asset_prices import insert_latest_prices
from tasks.add_historical_asset_profit import add_historical_asset_profit
from tasks.get_cex_account import get_cex_account
from tasks.update_asset_balances import update_asset_balances
from tasks.get_crypto_portfolio import get_crypto_portfolio
from tasks.get_prices import (
    get_latest_price,
    convert_to_price_map,
    convert_to_asset_id_map,
    get_latest_time
)
from tasks.get_latest_asset_profit import get_latest_asset_profits
from tasks.get_trades import get_trades
from tasks.index import TaskName
from utils.calculation import calc_change_in_balance, calc_estimated_balance, calculate_all_time_profit
from utils.connection import get_connection
from utils.data_model import (
    CEXAccount,
    AccountBalances,
    CryptoPortfolioForCalculation,
    LatestAssetPrice,
    LatestAssetProfit
)
from graphql_client.enums import CEXExchanges

sys.path.insert(0, "/root/airflow/dags/utils")

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

def get_combined_balance(accounts: List[CEXAccount]) -> List[AccountBalances]:
    balances = {}
    
    for account in accounts:
        for balance in account.balances:
            if balance.asset not in balances:
                balances[balance.asset] = AccountBalances(asset=balance.asset, free=balance.free, locked=balance.locked)
            else:
                balances[balance.asset].free += balance.free
                balances[balance.asset].locked += balance.locked
                
    return list(balances.values())


@task(task_id=TaskName.ADD_HISTORICAL_CRYPTO_BALANCE)
def add_historical_crypto_balance(
    crypto_portfolios: List[CryptoPortfolioForCalculation],
    accounts: List[CEXAccount],
    **kwargs
):
    conn = get_connection()
    latest_prices_map = kwargs["ti"].xcom_pull(task_ids=TaskName.CONVERT_TO_PRICE_MAP)
    asset_id_map = kwargs["ti"].xcom_pull(task_ids=TaskName.CONVERT_TO_ASSET_ID_MAP)
    latest_time = kwargs["ti"].xcom_pull(task_ids=TaskName.GET_LATEST_TIME)

    with conn.cursor() as cursor:
        for crypto_portfolio, account in zip(crypto_portfolios, accounts):
            balances = []
            if crypto_portfolio.exchanges == CEXExchanges.ALL:
                port_acc_map = find_child_portfolio_and_account(crypto_portfolios, accounts, crypto_portfolio.id)
                child_accounts = [v["account"] for v in port_acc_map.values()]
                balances = get_combined_balance(child_accounts)
            else:
                balances = account.balances
            
            prev_estimated_balance = crypto_portfolio.estimated_balance
            estimated_balance = calc_estimated_balance(
                balances, latest_prices_map, asset_id_map
            )
            change_balance, change_percent = calc_change_in_balance(
                prev_estimated_balance, estimated_balance
            )

            new_historical_balance = {
                "cryptoPortfolioId": crypto_portfolio.id,
                "time": latest_time,
                "estimatedBalance": estimated_balance,
                "changePercent": change_percent,
                "changeBalance": change_balance,
            }

            logging.info(new_historical_balance)
            cursor.execute(INSERT_HISTORICAL_BALANCE, new_historical_balance)
            conn.commit()

@task(task_id=TaskName.ADD_NOT_EXISTED_ASSET_INFO)
def get_not_existed_symbols(accounts: List[CEXAccount]):
    conn = get_connection()
    with conn.cursor() as cursor:
        not_existed_symbols = []
        for account in accounts:
            for balance in account.balances:
                logging.info(balance.asset)
                cursor.execute(GET_ONE_ASSET_INFO, (balance.asset,))
                asset_info = cursor.fetchone()
                if asset_info is None:
                    not_existed_symbols.append(balance.asset)

        return not_existed_symbols


# Define default arguments
default_args = {
    "owner": "airflow",
    "start_date": datetime(2024, 10, 26, 1, 0, 0),  # Adjust start date as needed
    "retries": 1,
    "retry_delay": timedelta(minutes=1),
}

with DAG(
    dag_id="update_crypto_portfolio",
    default_args=default_args,
    max_active_runs=1,
    catchup=False,
    schedule=timedelta(minutes=1),
) as dag:
    # get portfolios from database
    crypto_portfolios = get_crypto_portfolio()

    # get binance account
    accounts = get_cex_account(crypto_portfolios)
    
    # get not existed symbols
    not_existed_symbols = get_not_existed_symbols(accounts)
    symbol_infos = fetch_symbol_infos(not_existed_symbols)
    symbol_id_map = insert_asset_infos(symbol_infos)

    # get latest prices from database
    latest_prices_list = get_latest_price()

    # convert latest_prices_list to price map, asset id map, as well as get latest time to identify the current time
    latest_time = get_latest_time(latest_prices_list)
    latest_prices_map = convert_to_price_map(latest_prices_list)
    asset_id_map = convert_to_asset_id_map(latest_prices_list)

    new_crypto_portfolios = get_latest_asset_profits(crypto_portfolios)
    new_crypto_portfolios = get_trades(new_crypto_portfolios)

    (
        insert_latest_prices(symbol_id_map)
        >> latest_prices_list
        >> [latest_time, latest_prices_map, asset_id_map]
        >> update_asset_balances(crypto_portfolios, accounts)
        >> [add_historical_crypto_balance(crypto_portfolios, accounts), add_historical_asset_profit(new_crypto_portfolios, accounts)]
    )
