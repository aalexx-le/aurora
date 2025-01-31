from typing import List
from uuid import uuid4

from airflow.decorators import task
from psycopg.rows import class_row
from sql.update_crypto_portfolio import GET_TRADES
from tasks.index import TaskName
from utils.connection import get_connection
from utils.data_model import CryptoPortfolioForCalculation, Trade


@task(task_id=TaskName.GET_TRADES)
def get_trades(crypto_portfolios: List[CryptoPortfolioForCalculation]):
    conn = get_connection()
    with conn.cursor(row_factory=class_row(Trade)) as cursor:
        for crypto_portfolio in crypto_portfolios:
            cursor.execute(GET_TRADES, (crypto_portfolio.id,))
            trades = cursor.fetchall()
            crypto_portfolio.trades = trades

    return crypto_portfolios