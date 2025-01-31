import logging
from datetime import datetime, timedelta
from uuid import uuid4
from airflow import DAG
from airflow.decorators import task
from tasks.insert_asset_prices import get_symbol_id_map, insert_latest_prices 

logging.basicConfig(level=logging.INFO)


default_args = {
    'owner': 'airflow',
    'start_date': datetime(2024, 11, 10, 1, 0, 0),  # Adjust start date as needed
    'retries': 1,
    'retry_delay': timedelta(minutes=1),
}

@task(task_id='fetch_asset_price')
def fetch_asset_price():
    print("a")
    
    

with DAG(
        dag_id="fetch_asset_prices",
        default_args=default_args,
        catchup=False,
        schedule=timedelta(minutes=1),
) as dag:
    symbol_id_map = get_symbol_id_map()
    
    insert_latest_prices(symbol_id_map)
    