import json
import logging
from datetime import datetime, timedelta

import pytz
from airflow.decorators import task
from binance.client import Client
from mexc_api.common.enums import Interval
from mexc_api.spot import Spot
from psycopg.rows import class_row, dict_row
from sql.base import get_insert_sql_script, get_query_sql_script
from sql.fetch_asset_info import INSERT_ASSET_PROFILE
from sql.fetch_prices import GET_ASSET_INFO_BY_SYMBOL, INSERT_ASSET_PRICE_SQL
from utils.coinmarketcap import COINMARKETCAP_URL, get_cmk_session
from utils.connection import get_connection

GET_ALL_SYMBOLS_SQL = '''
    select ai.symbol, ai.id
    from "CryptoPortfolio" cp
    join "AssetBalance" ab on ab."cryptoPortfolioId" = cp."id"
    join "AssetInfo" ai on ai."id" = ab."assetInfoId";
'''

@task(task_id="get_symbol_id_map")
def get_symbol_id_map():
    conn = get_connection()
    
    with conn.cursor(row_factory=dict_row) as cursor:
        cursor.execute(GET_ALL_SYMBOLS_SQL)
        symbol_id_list = cursor.fetchall()
        symbol_id_map = {asset_info['symbol']:asset_info["id"] for asset_info in symbol_id_list}
        
        return symbol_id_map


@task(task_id="insert_latest_prices")
def insert_latest_prices(symbol_id_map: dict):
    conn = get_connection()
    binance_client = Client()
    mexc_client = Spot("", "")
    
    start_time = datetime.now()
    
    logging.info(f"Start Time: {start_time}")
    start_time = start_time.replace(second=0, microsecond=0)
    start_time = start_time - timedelta(minutes=1)
    start_timestamp_in_ms = int(start_time.timestamp() * 1000)
    logging.info(f"Start Time in ms: {start_timestamp_in_ms}")
    
    with conn.cursor() as cursor:
        for symbol, symbol_id in symbol_id_map.items():
            logging.info(f"Fetching Price for {symbol}")
        
            asset_price = None
            if symbol == 'USDT':
                asset_price = {
                    'assetInfoId': symbol_id,
                    'interval': '1m',
                    'open_time': start_time,
                    'close_time': start_time,
                    'openPrice': 1,
                    'closePrice': 1,
                    'highPrice': 1,
                    'lowPrice':  1,
                    'volume': 1
                }
            else:
                
                prices = []
                try:
                    prices = binance_client.get_klines(symbol=symbol + 'USDT', interval=Client.KLINE_INTERVAL_1MINUTE, startTime=start_timestamp_in_ms) 
                except Exception as e:
                    prices = mexc_client.market.klines(symbol + "USDT", Interval.ONE_MIN, start_ms=start_timestamp_in_ms, limit=1)
                    
                finally:
                    for price in prices:
                        try:
                            asset_price = {
                                'assetInfoId': symbol_id,
                                'interval': '1m',
                                'open_time': datetime.fromtimestamp(price[0] / 1000) + timedelta(hours=7),
                                'close_time': datetime.fromtimestamp(price[6] / 1000) + timedelta(hours=7),
                                'openPrice': price[1],
                                'closePrice': price[4],
                                'highPrice': price[2],
                                'lowPrice': price[3],
                                'volume': price[5]
                            }
                            
                            cursor.execute(INSERT_ASSET_PRICE_SQL, asset_price)
                            
                            logging.info(f"Add Price for {symbol} @ {asset_price["openPrice"]} at {asset_price['open_time']}")
            
                            conn.commit()
                        except Exception as e:
                            logging.error(e)
                            conn.rollback()
                            