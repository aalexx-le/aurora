import logging
from datetime import datetime
from typing import List, Dict
from uuid import uuid4

import pytz
from airflow.decorators import task
from graphql_client.enums import CEXExchanges
from tasks.index import TaskName
from utils.connection import get_connection
from utils.data_model import (
    CEXAccount,
    CryptoPortfolioForCalculation,
)

@task(task_id=TaskName.UPDATE_ASSET_BALANCES)
def update_asset_balances(
    crypto_portfolios: List[CryptoPortfolioForCalculation],
    accounts: List[CEXAccount],
    asset_id_map: Dict = None
):
    # Import SQL queries inside the task to avoid DAG import time issues
    from sql.update_crypto_portfolio import (
        DELETE_ASSET_BALANCES,
        INSERT_ASSET_BALANCE,
        UPDATE_CRYPTO_PROFILE_UPDATE_TIME,
    )
    
    conn = get_connection()
    
    # If asset_id_map wasn't passed directly, fall back to XCom for backward compatibility
    if asset_id_map is None:
        from airflow.operators.python import get_current_context
        ti = get_current_context()["ti"]
        asset_id_map = ti.xcom_pull(task_ids=TaskName.CONVERT_TO_ASSET_ID_MAP)

    with conn.cursor() as cursor:
        for crypto_portfolio, account in zip(crypto_portfolios, accounts):
            logging.info("Crypto Portfolio: " + str(crypto_portfolio.exchanges))
            if crypto_portfolio.update_time is not None:
                utc = pytz.UTC
                crypto_portfolio.update_time = utc.localize(
                    crypto_portfolio.update_time
                )

            # update asset balances if account has been updated
            # if (
            #     crypto_portfolio.update_time is None
            #     or account.updateTime > crypto_portfolio.update_time
            # ):
            
            # remove all existing balances
            cursor.execute(DELETE_ASSET_BALANCES, (crypto_portfolio.id,))

            # insert new balances
            for owning_coin in account.balances:
                if owning_coin is None:
                    continue
                
                symbol = owning_coin.asset
                asset_id = asset_id_map.get(symbol)
                logging.info(owning_coin)

                if asset_id is None:
                    continue
                
                logging.info("Add balance for " + str(owning_coin) + " with id " + str(asset_id) + " and balance " + str(owning_coin.free) + " and locked " + str(owning_coin.locked))

                data = {
                    "id": uuid4(),
                    "cryptoPortfolioId": crypto_portfolio.id,
                    "assetInfoId": asset_id,
                    "balance": owning_coin.free,
                    "locked": owning_coin.locked,
                }

                # Get SQL script at runtime
                insert_script = INSERT_ASSET_BALANCE()
                cursor.execute(insert_script, data)

            # update crypto profile update time
            cursor.execute(
                UPDATE_CRYPTO_PROFILE_UPDATE_TIME,
                (account.updateTime, crypto_portfolio.id),
            )
            conn.commit()