import json
import logging
import sys
from datetime import datetime, timedelta, timezone
from typing import List
from uuid import uuid4

import okx.Account as OKXAccountClient
from airflow.decorators import task
from binance.client import Client as BinanceClient
from graphql_client.enums import CEXExchanges
from mexc_api.spot import Spot as MexcClient
from tasks.index import TaskName
from utils.data_model import (AccountBalances, CEXAccount,
                              CryptoPortfolioForCalculation, LatestAssetPrice,
                              LatestAssetProfit)


@task(task_id=TaskName.GET_BINANCE_ACCOUNT)
def get_cex_account(
    crypto_portfolios: List[CryptoPortfolioForCalculation], **kwargs
):
    accounts = []

    for portfolio in crypto_portfolios:
        account = None
        
        try:
        
            if portfolio.exchanges == CEXExchanges.MEXC:
                mexc_client = MexcClient(portfolio.api_key, portfolio.secret_key)
                info = mexc_client.account.get_account_info()
                info['updateTime'] = datetime.now(timezone.utc)
                account = CEXAccount(**info, portfolio_id=portfolio.id)
                
                accounts.append(account)
                
            elif portfolio.exchanges == CEXExchanges.OKX:
                # conn = get_connection()
                # with conn.cursor(row_factory=dict_row) as cursor:
                #     cursor.execute(GET_OKX_PORTFOLIO, (portfolio.id,))
                #     payload = cursor.fetchone()
                
                # portfolio.passphrase = payload['passphrase']
                okx_client = OKXAccountClient.AccountAPI(portfolio.api_key, portfolio.secret_key, portfolio.passphrase, use_server_time=False, flag="0")
                account = CEXAccount(updateTime=datetime.now(timezone.utc), balances=[], portfolio_id=portfolio.id)
                data = okx_client.get_account_balance()['data']
                for balance in data[0]['details']:
                    account.balances.append(AccountBalances(asset=balance['ccy'], free=balance['availBal'], locked=balance['frozenBal']))
                    
                accounts.append(account)
            
            elif portfolio.exchanges == CEXExchanges.BINANCE:
                binance_client = BinanceClient(portfolio.api_key, portfolio.secret_key)
                account = CEXAccount(**binance_client.get_account(omitZeroBalances="true"), portfolio_id=portfolio.id)
                
                accounts.append(account)
                
            elif portfolio.exchanges == CEXExchanges.ALL:
                account = CEXAccount(updateTime=datetime.now(timezone.utc), balances=[], portfolio_id=portfolio.id)
                
                accounts.append(account)
                
        except Exception as e:
            logging.error(f"Error in fetching account for {portfolio.id} - {e}")    
            
            # add dummy account in case of error
            accounts.append(CEXAccount(updateTime=datetime.now(timezone.utc), balances=[], portfolio_id=""))
            continue

    return accounts