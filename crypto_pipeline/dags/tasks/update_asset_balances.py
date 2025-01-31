import json
import logging
import sys
from datetime import datetime, timedelta, timezone
from typing import List
from uuid import uuid4

import pytz
from airflow import DAG
from airflow.decorators import task
from psycopg.rows import class_row, dict_row
from sql.update_crypto_portfolio import (
    DELETE_ASSET_BALANCES,
    INSERT_ASSET_BALANCE,
    UPDATE_CRYPTO_PROFILE_UPDATE_TIME,
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
from graphql_client.enums import CEXExchanges

@task(task_id=TaskName.UPDATE_ASSET_BALANCES)
def update_asset_balances(
    crypto_portfolios: List[CryptoPortfolioForCalculation],
    accounts: List[CEXAccount],
    **kwargs
):
    conn = get_connection()
    asset_id_map = kwargs["ti"].xcom_pull(task_ids=TaskName.CONVERT_TO_ASSET_ID_MAP)

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
                
                logging.info("Add balance for " + str(owning_coin) + " with id " + str(asset_id))

                data = {
                    "id": uuid4(),
                    "cryptoPortfolioId": crypto_portfolio.id,
                    "assetInfoId": asset_id,
                    "balance": owning_coin.free,
                    "locked": owning_coin.locked,
                }

                cursor.execute(INSERT_ASSET_BALANCE, data)

            # update crypto profile update time
            cursor.execute(
                UPDATE_CRYPTO_PROFILE_UPDATE_TIME,
                (account.updateTime, crypto_portfolio.id),
            )
            conn.commit()