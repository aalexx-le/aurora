import json
import logging
import sys
from datetime import datetime, timedelta, timezone
from typing import List
from uuid import uuid4

from airflow.decorators import task
from graphql_client.enums import CEXExchanges
from tasks.exchange_strategies import ExchangeContext
from tasks.index import TaskName
from utils.data_model import (AccountBalances, CEXAccount,
                              CryptoPortfolioForCalculation, LatestAssetPrice,
                              LatestAssetProfit)


@task(task_id=TaskName.GET_BINANCE_ACCOUNT)
def get_cex_account(
    crypto_portfolios: List[CryptoPortfolioForCalculation], **kwargs
):
    accounts = []
    exchange_context = ExchangeContext()

    for portfolio in crypto_portfolios:
        try:
            account = exchange_context.fetch_account(
                exchange=portfolio.exchanges,
                api_key=portfolio.api_key,
                secret_key=portfolio.secret_key,
                portfolio_id=portfolio.id,
                passphrase=portfolio.passphrase if portfolio.exchanges == CEXExchanges.OKX else None
            )
            logging.info(f"{portfolio.exchanges} Account: {str(account)}")
            accounts.append(account)
                
        except Exception as e:
            logging.error(f"Error in fetching account for {portfolio.id} - {e}")    
            # add dummy account in case of error
            accounts.append(CEXAccount(updateTime=datetime.now(timezone.utc), balances=[], portfolio_id=""))
            continue

    return accounts