from airflow.decorators import task
from psycopg.rows import class_row
from sql.update_crypto_portfolio import GET_ALL_CRYPTO_PORTFOLIO
from tasks.index import TaskName
from utils.connection import get_connection
from utils.data_model import CryptoPortfolioForCalculation

@task(task_id=TaskName.GET_CRYPTO_PORTFOLIO)
def get_crypto_portfolio():
    """
    Get all crypto portfolios from the database.
    
    This task should only execute during task execution, not DAG definition time.
    """
    conn = get_connection()

    with conn.cursor(row_factory=class_row(CryptoPortfolioForCalculation)) as cursor:
        cursor.execute(GET_ALL_CRYPTO_PORTFOLIO)
        result = cursor.fetchall()

        return result
