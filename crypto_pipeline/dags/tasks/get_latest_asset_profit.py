from typing import List
from uuid import uuid4

from airflow.decorators import task
from psycopg.rows import class_row
from sql.update_crypto_portfolio import GET_LATEST_ASSET_PROFITS
from tasks.index import TaskName
from utils.connection import get_connection
from utils.data_model import CryptoPortfolioForCalculation, LatestAssetProfit


@task(task_id=TaskName.GET_LATEST_ASSET_PROFITS)
def get_latest_asset_profits(crypto_portfolios: List[CryptoPortfolioForCalculation]):
    conn = get_connection()
    with conn.cursor(row_factory=class_row(LatestAssetProfit)) as cursor:
        for crypto_portfolio in crypto_portfolios:
            cursor.execute(GET_LATEST_ASSET_PROFITS, (crypto_portfolio.id,))
            latest_asset_profits = cursor.fetchall()
            crypto_portfolio.latest_asset_profits = latest_asset_profits

    return crypto_portfolios