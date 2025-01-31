import json
import logging
import os
from datetime import datetime, timedelta
from enum import Enum
from typing import List
from uuid import uuid4

import okx.Account as OKXAccount
import pandas as pd
import psycopg
from binance.client import Client as BinanceClient
from dotenv import load_dotenv
from graphql_client.enums import CEXExchanges
from mexc_api.spot import Spot as MexcClient
from psycopg import sql
from psycopg.rows import class_row
from requests import Request, Session
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects
from utils.calculation import (calc_change_in_balance, calc_estimated_balance,
                               calculate_all_time_profit)
from utils.connection import get_connection
from utils.data_model import AccountBalances, CEXAccount, LatestAssetPrice
from utils.encoder import UUIDEncoder
from utils.encrypt import decrypt_key
from utils.sql_scripts import (get_insert_sql_script, get_query_sql_script,
                               get_update_sql_script)

load_dotenv()

class CreateExecutionStatus(str, Enum):
    QUEUE = "QUEUE"
    PROCESSING = "PROCESSING"
    FAILED = "FAILED"
    SUCCESS = "SUCCESS"

INSERT_CRYPTO_PORTFOLIO = get_insert_sql_script(
    "CryptoPortfolio",
    ['id', 'name', 'userId', 'tradingType', 'apiKey', 'secretKey', 'updateTime', 'exchanges']
)

INSERT_OKX_CRYPTO_PORTFOLIO = get_insert_sql_script(
    "OKXCryptoPortfolio",
    ['id', 'cryptoPortfolioId', 'passphrase']
)

INSERT_ASSET_BALANCE = get_insert_sql_script(
    "AssetBalance",
    ['id', 'cryptoPortfolioId', 'assetInfoId', 'balance', 'locked']
)
GET_ASSET_ID = get_query_sql_script(
    'AssetInfo',
    ['id'],
    'symbol'
)


INSERT_HISTORICAL_BALANCE = get_insert_sql_script(
    "HistoricalCryptoBalance", 
    ["cryptoPortfolioId", "time", "estimatedBalance", "changePercent", "changeBalance"]
)

INSERT_HISTORICAL_ASSET_PROFIT = get_insert_sql_script(
    "HistoricalAssetProfit",
    ["time", "cryptoPortfolioId", "assetInfoId", "estimatedProfit", "totalCostInQuoteQty", "remainingQty"]
)

UPDATE_EXECUTION_STATUS = sql.SQL("""
    UPDATE "CreatePortfolioExecution"
    SET status = %s
    WHERE id = %s
""")

UPDATE_EXECUTION_STATUS = get_update_sql_script("CreatePortfolioExecution", ["status"], "id = %s")

def convert_snapshot_balances(snapshot_balances) -> List[AccountBalances]:
    """Converts snapshot balances to a list of Balance objects."""
    balances = []
    for item in snapshot_balances:
        balances.append(AccountBalances(**item))
    return balances

def convert_to_price_map(latest_prices_list: List[LatestAssetPrice]):
    latest_prices_map = {
        price.asset_info_id: price.open_price for price in latest_prices_list
    }
    return latest_prices_map

def convert_to_asset_id_map(prices_list: List[LatestAssetPrice]):
    asset_id_map = {price.symbol: price.asset_info_id for price in prices_list}
    return asset_id_map

class CryptoPortfolioCreator:
    USDT_SYMBOL = 'USDT'
    CRYPTO_PORTFOLIO_CREATED_SUCCESS = 'crypto-portfolio-created-success'
    
    def __init__(self, producer) -> None:
        self.conn = get_connection()
        self.cursor = self.conn.cursor()
        self.producer = producer
        
    def create(self, payload) -> None:
        api_key = payload['apiKey']
        
        try:
            master_key = os.getenv('CRYPTO_PORTFOLIO_MASTER_KEY')
            secret_key = payload['secretKey']
            # secret_key = decrypt_key(encrypted_secret, master_key)
        except Exception as e:
            logging.error(e)
            return
        
        user_id = payload['userId']
        portfolio_name = payload['name']
        execution_id = payload['executionId']
        exchanges = payload['exchanges']
        
        self.cursor.execute(UPDATE_EXECUTION_STATUS, (CreateExecutionStatus.PROCESSING.value, execution_id))
        self.conn.commit()
        
        account = None
        try:
            if exchanges == CEXExchanges.MEXC:
                mexc_client = MexcClient(api_key, secret_key)
                info = mexc_client.account.get_account_info()
                info['updateTime'] = datetime.now()
                account = CEXAccount(**info)
            elif exchanges == CEXExchanges.OKX:
                passphrase = payload['passphrase']
                okx_client = OKXAccount.AccountAPI(api_key, secret_key, passphrase, use_server_time=False, flag="0")
                account = CEXAccount(updateTime=datetime.now(), balances=[])
                data = okx_client.get_account_balance()['data']
                for balance in data[0]['details']:
                    account.balances.append(AccountBalances(asset=balance['ccy'], free=balance['availBal'], locked=balance['frozenBal']))
            else:
                binance_client = BinanceClient(api_key, secret_key)
                info = binance_client.get_account(recvWindow=60000, omitZeroBalances='true')
                info['updateTime'] = datetime.now()
                account = CEXAccount(**info)
        except Exception as e:
            logging.error(e)
            logging.error("Failed to fetch account info, change status to FAILED")
            self.cursor.execute(UPDATE_EXECUTION_STATUS, (CreateExecutionStatus.FAILED.value, execution_id))
            self.conn.commit()
            return
        
        cursor = self.conn.cursor()
        portfolio_id = uuid4()
        data = {
            'id': portfolio_id,
            'name': portfolio_name,
            'userId': user_id,
            'tradingType': 'SPOT',
            'apiKey': api_key,
            'secretKey': secret_key,
            'exchanges': exchanges,
            'updateTime': account.updateTime
        }
        cursor.execute(INSERT_CRYPTO_PORTFOLIO, data)
        
        if exchanges == CEXExchanges.OKX:
            passphrase = payload['passphrase']
            data = {
                'id': uuid4(),
                'cryptoPortfolioId': portfolio_id,
                'passphrase': passphrase
            }
            cursor.execute(INSERT_OKX_CRYPTO_PORTFOLIO, data)


        for owning_coin in account.balances:
            symbol = owning_coin.asset
            
            try:
                cursor.execute(GET_ASSET_ID, (symbol,))
                results = cursor.fetchone()
                
                if results is None:
                    continue

                asset_id = results[0]
                data = {
                    'id': uuid4(),
                    'cryptoPortfolioId': portfolio_id,
                    'assetInfoId': asset_id,
                    'balance': owning_coin.free,
                    'locked': owning_coin.locked,
                    
                }
                cursor.execute(INSERT_ASSET_BALANCE, data)
            except (ConnectionError, Timeout, TooManyRedirects) as e:
                logging.error(symbol)
            
        self.conn.commit()
        
        # Fetch account snapshots for the past 3 month
        now_timestamp = datetime.now().timestamp()
        one_month_ago_timestamp = (datetime.now() - timedelta(days=30)).timestamp()

        account_snapshots = []
        if exchanges == CEXExchanges.BINANCE:
            account_snapshots = binance_client.get_account_snapshot(
                type="SPOT", 
                startTime=int(one_month_ago_timestamp * 1000), 
                endTime=int(now_timestamp * 1000)
            )['snapshotVos']
            
        prev_estimated_balance = 0
        for snapshot in account_snapshots:
            snapshot_time = datetime.fromtimestamp(snapshot['updateTime'] / 1000)
            balances = convert_snapshot_balances(snapshot['data']['balances'])

            prices_list = self.get_asset_prices_for_date(snapshot_time.strftime('%Y-%m-%d'))
            prices_map = convert_to_price_map(prices_list)
            asset_id_map = convert_to_asset_id_map(prices_list)

            estimated_balance = calc_estimated_balance(
                balances, prices_map, asset_id_map
            )
            
            if estimated_balance < 0.1:
                continue
            
            change_balance, change_percent = calc_change_in_balance(
                prev_estimated_balance, estimated_balance
            )
            
            prev_estimated_balance = estimated_balance


            new_historical_balance = {
                "cryptoPortfolioId": portfolio_id,
                "time": snapshot_time,
                "estimatedBalance": estimated_balance,
                "changePercent": change_percent,
                "changeBalance": change_balance,
            }

            cursor.execute(INSERT_HISTORICAL_BALANCE, new_historical_balance)
            self.conn.commit()

            for balance_entry in balances:
                symbol = balance_entry.asset
                if symbol not in asset_id_map:
                    continue
                symbol_id = asset_id_map[symbol]
                if symbol_id not in prices_map:
                    continue
                latest_price = prices_map[symbol_id]

                trades = []
                if exchanges == CEXExchanges.MEXC:
                    # Implement MEXC trade retrieval logic
                    pass  
                elif exchanges == CEXExchanges.BINANCE:
                    trades = binance_client.get_my_trades(
                        symbol=symbol + "USDT"
                    )

                total_cost_usdt, remaining_qty, current_profit_usdt = calculate_all_time_profit(
                    trades, latest_price
                )

                data = {
                    "cryptoPortfolioId": portfolio_id,
                    "assetInfoId": symbol_id,
                    "time": snapshot_time,
                    "estimatedProfit": current_profit_usdt,
                    "totalCostInQuoteQty": total_cost_usdt,
                    "remainingQty": remaining_qty,
                }

                cursor.execute(INSERT_HISTORICAL_ASSET_PROFIT, data)
                self.conn.commit()
            
            
        logging.info("Successfully created crypto portfolio for user " + str(user_id))
        self.cursor.execute(UPDATE_EXECUTION_STATUS, (CreateExecutionStatus.SUCCESS.value, execution_id))
        self.conn.commit()
        
        success_payload = {
            "userId": user_id,
            "cryptoPortfolioId": portfolio_id,
        }
        self.producer.send(self.CRYPTO_PORTFOLIO_CREATED_SUCCESS, json.dumps(success_payload, cls=UUIDEncoder).encode("utf-8"))
        
    def get_asset_prices_for_date(self, date_str) -> List[LatestAssetPrice]:
        """
        Retrieves asset prices for a given date.

        Args:
            conn: A psycopg connection object.
            date_str: A string representing the date in 'YYYY-MM-DD' format.

        Returns:
            A list of tuples, where each tuple contains (symbol, asset_info_id, open_price, open_time).
            Returns None if an error occurs.
        """
        try:
            with self.conn.cursor(row_factory=class_row(LatestAssetPrice)) as cur:
                query = sql.SQL("""
                    SELECT
                        ai."symbol",
                        ap."assetInfoId" as asset_info_id,
                        ap."openPrice" as open_price,
                        ap."open_time"
                    FROM
                        "AssetPrice" ap
                    JOIN "AssetInfo" ai on ai.id = ap."assetInfoId"
                    WHERE ap.open_time = to_date(%s, 'YYYY-MM-DD')
                """)
                cur.execute(query, (date_str,))  # Pass date_str as a parameter
                results = cur.fetchall()
                return results
        except psycopg.Error as e:
            print(f"Error executing query: {e}")
            return []