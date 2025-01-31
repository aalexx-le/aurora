import functools
import json
import logging
import sys
from datetime import datetime, timedelta
from typing import List
from uuid import uuid4
from airflow  import DAG
from airflow.decorators import task, task_group
from airflow.models import Variable
from airflow.models.param import Param
from requests import Session
from sql.fetch_asset_info import INSERT_ASSET_PROFILE
from utils.connection import get_connection
from utils.date_time import timestamp_to_date  # Replace with actual path
from utils.coinmarketcap import get_cmk_session, COINMARKETCAP_URL, COINMARKETCAP_SYMBOL_PER_REQUEST
from tasks.insert_asset_infos import fetch_symbol_infos, insert_asset_infos

logging.basicConfig(level=logging.INFO)



default_args = {
    'owner': 'airflow',
    'start_date': datetime(2024, 11, 10, 1, 0, 0),  # Adjust start date as needed
    'retries': 1,
    'retry_delay': timedelta(minutes=1),
}

@task(task_id='fetch_symbol_list')
def fetch_symbol_list():
    cmk_session = get_cmk_session()

    response = cmk_session.get(COINMARKETCAP_URL + '/v1/cryptocurrency/map', params={'sort': 'cmc_rank'})
    coin_map = json.loads(response.text)
    
    
    
    if 'data' in coin_map:
        
        symbol_string = functools.reduce(lambda x, y: x + "," + y, [coin['symbol'] for coin in coin_map['data']])
            
        symbol_list = symbol_string.split(',')
        
        symbol_lists = []
        for i in range(0, len(symbol_list), COINMARKETCAP_SYMBOL_PER_REQUEST):
            symbol_lists.append(symbol_list[i:i + COINMARKETCAP_SYMBOL_PER_REQUEST])
            
        return symbol_lists
    else:
        logging.error(coin_map)
        return []
    

with DAG(
        dag_id="fetch_asset_info",
        default_args=default_args,
        catchup=False,
        # schedule_interval='* * * * *',  # Runs every minute
        # schedule=timedelta(minutes=1),
        params={
            'symbol': Param("",type="string")
        },
        # schedule=None,
) as dag:
    # symbol_list = fetch_symbol_list()
    
    symbol_infos = fetch_symbol_infos(symbol_list=['melania'])
    insert_asset_infos(symbol_infos)
    
    
# with DAG(
#         dag_id="fetch_asset_info",
#         default_args=default_args,
#         catchup=False,
#         # schedule_interval='* * * * *',  # Runs every minute
#         schedule=timedelta(minutes=1),
#         params={
#             'symbol': Param("1mbabydoge",type="string")
#         },
#         # schedule=None,
# ) as dag:
#     symbol_list = fetch_symbol_list()
    
#     add_asset_info.expand(symbol_list=symbol_list)
    