from typing import List
import logging

from airflow.decorators import task
from tasks.index import TaskName
from utils.connection import get_connection
from utils.data_model import CEXAccount

@task(task_id=TaskName.ADD_NOT_EXISTED_ASSET_INFO)
def get_not_existed_symbols(accounts: List[CEXAccount]):
    """
    Get symbols that don't exist in the asset_info table.
    
    This task should only execute during task execution, not DAG definition time.
    """
    # Import SQL query inside the task
    from sql.update_crypto_portfolio import GET_ONE_ASSET_INFO
    
    conn = get_connection()
    with conn.cursor() as cursor:
        not_existed_symbols = []
        for account in accounts:
            for balance in account.balances:
                logging.info(balance.asset)
                # Get SQL script at runtime
                asset_info_script = GET_ONE_ASSET_INFO()
                cursor.execute(asset_info_script, (balance.asset,))
                asset_info = cursor.fetchone()
                if asset_info is None:
                    not_existed_symbols.append(balance.asset)

        return not_existed_symbols 