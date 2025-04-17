from abc import ABC, abstractmethod
from datetime import datetime, timezone
from typing import List

import ccxt
import okx.Account as OKXAccountClient
from binance.client import Client as BinanceClient
from graphql_client.enums import CEXExchanges
from utils.data_model import AccountBalances, CEXAccount


class ExchangeStrategy(ABC):
    @abstractmethod
    def fetch_account(self, api_key: str, secret_key: str, **kwargs) -> CEXAccount:
        pass

class MexcStrategy(ExchangeStrategy):
    def fetch_account(self, api_key: str, secret_key: str, **kwargs) -> CEXAccount:
        mexc = ccxt.mexc({
            'apiKey': api_key,
            'secret': secret_key,
            'enableRateLimit': True,
            'options': {
                'recvWindow': 60000,
                'adjustForTimeDifference': True,
            }
        })
        balance = mexc.fetch_balance()
        
        # Transform CCXT balance data to match CEXAccount model
        balances_list: List[AccountBalances] = []
        info = {
            'updateTime': datetime.now(timezone.utc),
            'balances': balances_list,
            'portfolio_id': kwargs.get('portfolio_id', '')
        }
        
        # Process total balances
        for currency, data in balance['total'].items():
            if float(data) > 0:  # Only include non-zero balances
                balances_list.append(AccountBalances(
                    asset=currency,
                    free=float(balance['free'].get(currency, 0)),
                    locked=float(balance['used'].get(currency, 0))
                ))
        
        return CEXAccount(**info)

class OkxStrategy(ExchangeStrategy):
    def fetch_account(self, api_key: str, secret_key: str, **kwargs) -> CEXAccount:
        passphrase = kwargs.get('passphrase')
        okx_client = OKXAccountClient.AccountAPI(api_key, secret_key, passphrase, use_server_time=False, flag="0")
        account = CEXAccount(updateTime=datetime.now(timezone.utc), balances=[], portfolio_id=kwargs.get('portfolio_id', ''))
        data = okx_client.get_account_balance()['data']
        for balance in data[0]['details']:
            account.balances.append(AccountBalances(
                asset=balance['ccy'],
                free=balance['availBal'],
                locked=balance['frozenBal']
            ))
        return account

class BinanceStrategy(ExchangeStrategy):
    def fetch_account(self, api_key: str, secret_key: str, **kwargs) -> CEXAccount:
        binance_client = BinanceClient(api_key, secret_key)
        info = binance_client.get_account(recvWindow=60000, omitZeroBalances='true')
        info['updateTime'] = datetime.now(timezone.utc)
        info['portfolio_id'] = kwargs.get('portfolio_id', '')
        account = CEXAccount(**info)
        
        for balance in account.balances:
            balance.asset = balance.asset.replace('LD', '')
        
        return account

class AllStrategy(ExchangeStrategy):
    def fetch_account(self, api_key: str, secret_key: str, **kwargs) -> CEXAccount:
        return CEXAccount(
            updateTime=datetime.now(timezone.utc),
            balances=[],
            portfolio_id=kwargs.get('portfolio_id', '')
        )

class ExchangeContext:
    def __init__(self):
        self._strategies = {
            CEXExchanges.MEXC: MexcStrategy(),
            CEXExchanges.OKX: OkxStrategy(),
            CEXExchanges.BINANCE: BinanceStrategy(),
            CEXExchanges.ALL: AllStrategy()
        }
    
    def fetch_account(self, exchange: CEXExchanges, api_key: str, secret_key: str, **kwargs) -> CEXAccount:
        strategy = self._strategies.get(exchange)
        if not strategy:
            raise ValueError(f"Unsupported exchange: {exchange}")
        return strategy.fetch_account(api_key, secret_key, **kwargs) 