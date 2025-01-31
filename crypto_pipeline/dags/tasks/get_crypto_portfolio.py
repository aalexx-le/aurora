from airflow.decorators import task
from psycopg.rows import class_row, dict_row
from sql.update_crypto_portfolio import (
    GET_ALL_CRYPTO_PORTFOLIO,
)
from tasks.index import TaskName
from utils.connection import get_connection
from utils.data_model import (
    CEXAccount,
    AccountBalances,
    CryptoPortfolioForCalculation,
    LatestAssetPrice,
    LatestAssetProfit
)

@task(task_id=TaskName.GET_CRYPTO_PORTFOLIO)
def get_crypto_portfolio():
    conn = get_connection()

    with conn.cursor(row_factory=class_row(CryptoPortfolioForCalculation)) as cursor:
        cursor.execute(GET_ALL_CRYPTO_PORTFOLIO)
        result = cursor.fetchall()

        return result
