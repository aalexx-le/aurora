from datetime import datetime
from typing import List, Optional

from graphql_client.input_types import (
    AssetBalanceCreateManyCryptoProfileInput,)
from graphql_client.enums import CEXExchanges
from pydantic import BaseModel


class AssetBalanceForCalculation(AssetBalanceCreateManyCryptoProfileInput):
    locked: Optional[float] = None

class LatestAssetProfit(BaseModel):
    time: datetime
    asset_info_id: str
    estimated_profit: float
    total_cost_in_quote_qty: float
    remaining_qty: float

class CryptoPortfolioForCalculation(BaseModel):
    id: str
    update_time: Optional[datetime]
    exchanges: CEXExchanges
    trading_type: str
    api_key: str
    secret_key: str
    
    estimated_balance: Optional[float]
    change_percent: Optional[float]
    change_balance: Optional[float]

    latest_asset_profits: Optional[List[LatestAssetProfit]] = []
    
    
class LatestAssetPrice(BaseModel):
    asset_info_id: str
    open_price: float
    open_time: datetime
    symbol: str
    
    
class AccountBalances(BaseModel):
    asset: str
    free: float
    locked: float
    
class CEXAccount(BaseModel):
    updateTime: datetime
    balances: List[AccountBalances]
    
class BinanceKline(BaseModel):
    open_time: datetime
    close_time: datetime
    open_price: float
    close_price: float
    high_price: float
    low_price: float
    volume: float
    
    