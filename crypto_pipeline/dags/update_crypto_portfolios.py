import logging
import sys
from datetime import datetime, timedelta
from typing import List, Dict

from airflow.decorators import task, dag
from sql.update_crypto_portfolio import (
    GET_ONE_ASSET_INFO,
    INSERT_HISTORICAL_BALANCE,
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
from tasks.get_not_existed_symbols import get_not_existed_symbols
from tasks.get_prices import (
    get_latest_price,
    convert_to_price_map,
    convert_to_asset_id_map,
    get_latest_time
)
from tasks.get_latest_asset_profit import get_latest_asset_profits
from tasks.get_trades import get_trades
from tasks.index import TaskName
from utils.calculation import calc_change_in_balance, calc_estimated_balance
from utils.connection import get_connection
from utils.data_model import (
    CEXAccount,
    AccountBalances, 
    CryptoPortfolioForCalculation,
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
    latest_prices_map: Dict,
    asset_id_map: Dict,
    latest_time: datetime
):
    from sql.update_crypto_portfolio import INSERT_HISTORICAL_BALANCE
    conn = get_connection()

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
            # Get the SQL script at runtime
            insert_script = INSERT_HISTORICAL_BALANCE()
            cursor.execute(insert_script, new_historical_balance)
            conn.commit()


# Use the TaskFlow API @dag decorator instead of creating a DAG instance
@dag(
    dag_id="update_crypto_portfolio",
    start_date=datetime(2024, 10, 26, 1, 0, 0),
    max_active_runs=1,
    catchup=False,
    schedule=timedelta(minutes=1),
    default_args={
        "owner": "airflow",
        "retries": 1,
        "retry_delay": timedelta(minutes=1),
    },
)
def update_crypto_portfolio_dag():
    # Get portfolios from database
    crypto_portfolios = get_crypto_portfolio()
    
    # Get CEX accounts - depends on crypto_portfolios
    accounts = get_cex_account(crypto_portfolios)
    
    # Get not existed symbols - depends on accounts
    not_existed_symbols = get_not_existed_symbols(accounts)
    symbol_infos = fetch_symbol_infos(not_existed_symbols)
    symbol_id_map = insert_asset_infos(symbol_infos)
    
    # Insert latest prices for new assets
    insert_prices = insert_latest_prices(symbol_id_map)
    
    # Get latest prices from database
    latest_prices_list = get_latest_price()
    
    # This task depends on insert_prices and latest_prices_list
    insert_prices >> latest_prices_list
    
    # Get price information and transformations
    latest_time = get_latest_time(latest_prices_list)
    latest_prices_map = convert_to_price_map(latest_prices_list)
    asset_id_map = convert_to_asset_id_map(latest_prices_list)
    
    # Get portfolio data and trades
    new_crypto_portfolios = get_latest_asset_profits(crypto_portfolios)
    trades = get_trades(new_crypto_portfolios)
    
    # Update asset balances - depends on price data
    update_balances = update_asset_balances(
        crypto_portfolios,
        accounts,
        asset_id_map
    )
    
    # Create task dependencies
    [latest_time, latest_prices_map, asset_id_map] >> update_balances
    
    # Add historical data - depends on balance updates
    add_history = add_historical_crypto_balance(
        crypto_portfolios,
        accounts,
        latest_prices_map,
        asset_id_map,
        latest_time
    )
    
    add_profit_history = add_historical_asset_profit(
        trades,
        accounts,
        latest_prices_map,
        asset_id_map,
        latest_time
    )
    
    # Set dependencies for final tasks
    update_balances >> [add_history, add_profit_history]


# Create the DAG
update_crypto_portfolio_dag()
