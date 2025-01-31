import json
import logging
from typing import List
from uuid import uuid4

from airflow.decorators import task
from sql.fetch_asset_info import INSERT_ASSET_PROFILE
from utils.coinmarketcap import COINMARKETCAP_URL, get_cmk_session
from utils.connection import get_connection
import re

@task(task_id="fetch_asset_infos")
def fetch_symbol_infos(symbol_list: List[str]) -> List[dict]:
    cmk_session = get_cmk_session()
    
    symbol_list = list(filter(lambda s: 'LD' not in s, symbol_list))
    
    response = cmk_session.get(COINMARKETCAP_URL + '/v2/cryptocurrency/info', params={'symbol': ','.join(symbol_list)})
    coin_prices = json.loads(response.text)
    
    if 'status' in coin_prices and coin_prices['status']['error_code'] == 400:
        error_message = coin_prices['status']['error_message']

        match = re.search(r'"symbol": "([^"]+)"', error_message)

        if match:
            invalid_symbols_string = match.group(1)
            invalid_symbols = set(invalid_symbols_string.split(','))
            print(invalid_symbols)
            
            valid_symbols = set(symbol_list) - invalid_symbols
            response = cmk_session.get(COINMARKETCAP_URL + '/v2/cryptocurrency/info', params={'symbol': ','.join(valid_symbols)})
            coin_prices = json.loads(response.text)
        else:
            print("No invalid symbols found in the error message.")
    
    if 'data' in coin_prices:
        symbol_infos = []
        for symbol in coin_prices['data']:
            symbol_info = coin_prices['data'][symbol][0]
            symbol_infos.append(symbol_info)
            
        return symbol_infos
    
    return []
    
        
@task(task_id="insert_asset_infos")
def insert_asset_infos(symbol_infos: List[dict]) -> dict:
    conn = get_connection()
    
    inserted_symbol_id_map = {}
    with conn.cursor() as cursor:
        for info in symbol_infos:
            data = {
                'id': uuid4(),
                'name': info['name'],
                'symbol': info['symbol'],
                'category': info['category'],
                'desc': info['description'],
                'logo': info['logo']
            }
            
            logging.info(f"Inserting asset info {info['symbol']}")
            
            cursor.execute(INSERT_ASSET_PROFILE, data)
            
            inserted_symbol_id_map[info['symbol']] = data['id']
        
        conn.commit()
        
    return inserted_symbol_id_map