import json
import logging
from typing import List
from airflow.decorators import task
from psycopg.rows import class_row
from sql.update_crypto_portfolio import (
    GET_LATEST_PRICES,
)
from tasks.index import TaskName
from utils.connection import get_connection
from utils.data_model import (
    LatestAssetPrice,
)


@task(task_id=TaskName.GET_LATEST_PRICE)
def get_latest_price():
    conn = get_connection()
    with conn.cursor(row_factory=class_row(LatestAssetPrice)) as cur:
        cur.execute(query=GET_LATEST_PRICES)
        latest_prices_list = cur.fetchall()
        logging.info(latest_prices_list)
        return latest_prices_list


@task(task_id=TaskName.CONVERT_TO_PRICE_MAP)
def convert_to_price_map(latest_prices_list: List[LatestAssetPrice]):
    latest_prices_map = {
        price.asset_info_id: price.open_price for price in latest_prices_list
    }
    return latest_prices_map


@task(task_id=TaskName.CONVERT_TO_ASSET_ID_MAP)
def convert_to_asset_id_map(prices_list: List[LatestAssetPrice]):
    asset_id_map = {price.symbol: price.asset_info_id for price in prices_list}
    return asset_id_map


@task(task_id=TaskName.GET_LATEST_TIME)
def get_latest_time(latest_prices_list: List[LatestAssetPrice]):
    latest_time = None
    if len(latest_prices_list) > 0:
        for price in latest_prices_list:
            if price not in ["USDT", "FDUSD"]:
                if latest_time is None or price.open_time > latest_time:
                    latest_time = price.open_time
    return latest_time