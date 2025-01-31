from utils.data_model import AccountBalances
from typing import List
import pandas as pd

def calc_estimated_balance(balances: List[AccountBalances], price_map: dict, asset_id_map: dict):
    total = 0
    for balance in balances:
        if balance.asset == 'USDT':
            total += balance.free + balance.locked
        # if symbol currently do not have price (launchpad token)
        elif balance.asset not in asset_id_map or asset_id_map[balance.asset] not in price_map:
            continue
        else:
            total += balance.free * price_map[asset_id_map[balance.asset]] + balance.locked * price_map[asset_id_map[balance.asset]]
        
    return total

def calc_change_in_balance(prev_balance: float, cur_balance: float):
    if prev_balance == None:
        prev_balance = 0
    if cur_balance == None:
        cur_balance = 0
        
    change_balance = cur_balance - prev_balance
    change_percent = (change_balance / prev_balance) * 100 if prev_balance > 0.1 else 0
    
    return change_balance, change_percent

def calculate_current_profit(trades, current_price):
    if len(trades) == 0:
        return 0, 0, 0

    df = pd.DataFrame(trades)
    df["quoteQty"] = pd.to_numeric(df["quoteQty"])
    df["qty"] = pd.to_numeric(df["qty"])

    df["cost_usdt"] = df["quoteQty"]  # Initialize cost in USDT with quoteQty
    df.loc[df["isBuyer"] == False, "cost_usdt"] = -df[
        "cost_usdt"
    ]  # Negate cost for sell orders

    total_cost_usdt = df["cost_usdt"].sum()
    remaining_qty = (
        df[df["isBuyer"] == True]["qty"].sum() - df[df["isBuyer"] == False]["qty"].sum()
    )

    current_value_usdt = remaining_qty * current_price
    current_profit_usdt = current_value_usdt - total_cost_usdt

    return total_cost_usdt, remaining_qty, current_profit_usdt

def calculate_all_time_profit(trades, current_price):
    """
    Calculates the all-time profit/loss for a coin, considering all transactions.

    Args:
      trades: A list of trade dictionaries, each with keys:
               - 'isBuyer': Boolean indicating if it's a buy order.
               - 'quoteQty': The quantity of quote asset (e.g., USDT) used in the trade.
               - 'qty': The quantity of base asset (e.g., BTC) traded.
      current_price: The current price of the base asset in quote asset.

    Returns:
      A tuple containing:
        - total_cost_usdt: The total cost of all buy transactions in USDT.
        - remaining_qty: The remaining quantity of the base asset held.
        - all_time_profit_usdt: The all-time profit/loss in USDT.
    """
    if len(trades) == 0:
        return 0, 0, 0

    df = pd.DataFrame(trades)
    df["quoteQty"] = pd.to_numeric(df["quoteQty"])
    df["qty"] = pd.to_numeric(df["qty"])

    df["cost_usdt"] = df["quoteQty"]  # Initialize cost in USDT with quoteQty
    df.loc[df["isBuyer"] == False, "cost_usdt"] = -df[
        "cost_usdt"
    ]  # Negate cost for sell orders

    total_cost_usdt = df["cost_usdt"].sum()

    # Calculate the worth of sell transactions
    sell_transactions_worth = df[df["isBuyer"] == False]["quoteQty"].sum()

    # Calculate the worth of buy transactions
    buy_transactions_worth = df[df["isBuyer"] == True]["quoteQty"].sum()

    # Calculate remaining quantity
    remaining_qty = (
        df[df["isBuyer"] == True]["qty"].sum() - df[df["isBuyer"] == False]["qty"].sum()
    )

    # Calculate current worth of current holdings
    current_worth = remaining_qty * current_price

    # Calculate all-time P/L
    all_time_profit_usdt = (
        current_worth + sell_transactions_worth - buy_transactions_worth
    )

    return total_cost_usdt, remaining_qty, all_time_profit_usdt