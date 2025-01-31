from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field

import psycopg
import psycopg2.extras
from graphql_client.input_types import (
    AssetBalanceCreateManyCryptoProfileInput,
    AssetPriceCreateManyAssetInfoInput,
    HistoricalCryptoBalanceCreateManyCryptoProfileInput)
from graphql_client.enums import CEXExchanges
from psycopg import sql
from psycopg.rows import class_row

from sql.base import (get_all_query_sql_script, get_insert_sql_script,
                      get_query_sql_script)


class AssetBalanceForCalculation(AssetBalanceCreateManyCryptoProfileInput):
    locked: Optional[float] = None

class LatestAssetProfit(BaseModel):
    time: datetime
    asset_info_id: str
    estimated_profit: float
    total_cost_in_quote_qty: float
    remaining_qty: float
    
class LatestTrade(BaseModel):
    time: datetime
    asset_info_id: str
    crypto_portfolio_id: str
    
class Trade(BaseModel):
    cryptoPortfolioId: str = Field(description="Crypto portfolio ID")
    assetInfoId: str = Field(description="Asset info ID")
    price: float = Field(description="Price")
    qty: float = Field(description="Quantity")
    quoteQty: float = Field(description="Quote quantity")
    commission: float = Field(description="Commission")
    commissionAsset: str = Field(description="Commission asset")
    time: datetime = Field(description="Trade time")
    isBuyer: bool = Field(description="Is buyer (True) or seller (False)")

class CryptoPortfolioForCalculation(BaseModel):
    id: str
    parent_portfolio_id: Optional[str]
    update_time: Optional[datetime]
    exchanges: CEXExchanges
    trading_type: str
    api_key: str
    secret_key: str
    passphrase: Optional[str]
    
    estimated_balance: Optional[float]
    change_percent: Optional[float]
    change_balance: Optional[float]

    latest_asset_profits: Optional[List[LatestAssetProfit]] = []
    trades: Optional[List[Trade]] = []
    
    
    
class LatestAssetPrice(BaseModel):
    asset_info_id: str
    open_price: float
    open_time: datetime
    symbol: str
    
    
class AccountBalances(BaseModel):
    asset: str
    free: float
    locked: float

# class BinanceAccount(BaseModel):
#     updateTime: datetime
#     balances: List[AccountBalances]
    
class CEXAccount(BaseModel):
    portfolio_id: str
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
    
    
from typing import Optional
from pydantic import BaseModel, Field



class OKXTrade(BaseModel):
    fillSz: str = Field(description="Filled size")
    fillPxVol: Optional[str] = Field(None, description="Fill price volume")
    fillFwdPx: Optional[str] = Field(None, description="Fill forward price")
    fee: str = Field(description="Fee")
    ordId: str = Field(description="Order ID")
    feeRate: str = Field(description="Fee rate")
    clOrdId: Optional[str] = Field(None, description="Client order ID")
    posSide: str = Field(description="Position side")
    fillMarkVol: Optional[str] = Field(None, description="Fill mark volume")
    tag: Optional[str] = Field(None, description="Tag")
    execType: str = Field(description="Execution type")
    fillIdxPx: Optional[str] = Field(None, description="Fill index price")
    side: str = Field(description="Side")
    fillPx: str = Field(description="Fill price")
    fillPnl: str = Field(description="Fill PNL")
    instType: str = Field(description="Instrument type")
    fillPxUsd: Optional[str] = Field(None, description="Fill price in USD")
    instId: str = Field(description="Instrument ID")
    billId: str = Field(description="Bill ID")
    subType: str = Field(description="Sub type")
    fillTime: str = Field(description="Fill time (timestamp)")
    tradeId: str = Field(description="Trade ID")
    fillMarkPx: Optional[str] = Field(None, description="Fill mark price")
    feeCcy: str = Field(description="Fee currency")
    ts: str = Field(description="Timestamp")
