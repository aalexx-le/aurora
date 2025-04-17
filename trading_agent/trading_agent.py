"""
Multi-Exchange Trading Agent System

This architecture provides a framework for creating trading agents that can work across
multiple cryptocurrency exchanges (Binance, OKX, MEXC).
"""

import json
import logging
import os
import time
from abc import ABC, abstractmethod
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple, Union

# Exchange API libraries
import ccxt
import numpy as np
import pandas as pd

from strategy.index import Strategy
from utils.logger import log_trade

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("trading_agent.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("trading_agent")

class ExchangeConnector:
    """Handles communication with different exchanges using CCXT."""
    
    def __init__(self, exchange_id: str, api_key: str, secret: str, additional_params: Dict = None):
        """
        Initialize an exchange connection.
        
        Args:
            exchange_id: The exchange identifier (e.g., 'binance', 'okx', 'mexc')
            api_key: API key for the exchange
            secret: Secret key for the exchange
            additional_params: Additional parameters required by specific exchanges
        """
        self.exchange_id = exchange_id
        self.additional_params = additional_params or {}
        
        # Initialize the CCXT exchange object
        exchange_class = getattr(ccxt, exchange_id)
        
        # Special configuration for MEXC
        if exchange_id == 'mexc':
            exchange_config = {
                'apiKey': api_key,
                'secret': secret,
                'enableRateLimit': True,
                'options': {
                    'defaultType': 'spot',
                    'recvWindow': 60000,
                    'adjustForTimeDifference': True,
                    'timeDifference': 0  # Will be adjusted automatically
                },
                'timeout': 30000
            }
        else:
            exchange_config = {
                'apiKey': api_key,
                'secret': secret,
                **self.additional_params
            }
        
        self.exchange = exchange_class(exchange_config)
        self.exchange.load_markets()
        
        # For MEXC, calculate and set time difference
        if exchange_id == 'mexc':
            server_time = self.exchange.fetch_time()
            local_time = int(time.time() * 1000)
            self.exchange.options['timeDifference'] = server_time - local_time
        
        logger.info(f"Initialized connection to {exchange_id}")
        
    def get_balance(self) -> Dict:
        """Get account balance."""
        try:
            return self.exchange.fetch_balance()
        except Exception as e:
            logger.error(f"Error getting balance from {self.exchange_id}: {e}")
            return {}
    
    def place_order(self, symbol: str, order_type: str, side: str, 
                   amount: float, price: Optional[float] = None) -> Dict:
        """
        Place an order on the exchange.
        
        Args:
            symbol: Trading pair symbol
            order_type: Type of order ('limit', 'market')
            side: Order side ('buy', 'sell')
            amount: Amount to buy/sell
            price: Price for limit orders
            
        Returns:
            Order response from the exchange
        """
        try:
            if order_type == 'limit' and price is not None:
                return self.exchange.create_order(symbol, order_type, side, amount, price)
            elif order_type == 'market':
                return self.exchange.create_order(symbol, order_type, side, amount)
            else:
                logger.error(f"Invalid order parameters: {order_type}, {side}, {amount}, {price}")
                return {}
        except Exception as e:
            logger.error(f"Error placing {order_type} {side} order for {symbol} on {self.exchange_id}: {e}")
            return {}
    
    def get_open_orders(self, symbol: Optional[str] = None) -> List[Dict]:
        """Get open orders, optionally filtered by symbol."""
        try:
            return self.exchange.fetch_open_orders(symbol)
        except Exception as e:
            logger.error(f"Error getting open orders from {self.exchange_id}: {e}")
            return []
    
    def cancel_order(self, order_id: str, symbol: Optional[str] = None) -> Dict:
        """Cancel an order by ID."""
        try:
            return self.exchange.cancel_order(order_id, symbol)
        except Exception as e:
            logger.error(f"Error canceling order {order_id} on {self.exchange_id}: {e}")
            return {}











class Agent:
    """Trading agent that integrates exchanges and multiple strategies."""
    
    def __init__(
        self,
        name: str,
        exchanges: Dict[str, ExchangeConnector],
        strategies: List[Strategy],
        strategy_weights: Dict[str, float] = None,
        aggregation_mode: str = 'weighted',
        config: Dict = None
    ):
        """
        Initialize a trading agent.
        
        Args:
            name: Agent name
            exchanges: Dictionary mapping exchange IDs to ExchangeConnector objects
            strategies: List of trading strategies to use
            strategy_weights: Dictionary mapping strategy names to weights
            aggregation_mode: How to aggregate signals ('weighted', 'consensus', 'majority')
            config: Agent configuration parameters
        """
        self.name = name
        self.exchanges = exchanges
        self.strategies = strategies
        self.aggregation_mode = aggregation_mode
        
        # Set default weights if not provided
        if strategy_weights is None:
            self.strategy_weights = {s.name: 1.0/len(strategies) for s in strategies}
        else:
            # Normalize weights to sum to 1
            total_weight = sum(strategy_weights.values())
            self.strategy_weights = {k: v/total_weight for k, v in strategy_weights.items()}
        
        self.config = config or {
            'max_order_amount_usd': 100,
            'enable_trading': False,
            'update_interval': 60,
            'stop_loss_pct': 5,
            'take_profit_pct': 10
        }
        
        self.positions = {}
        self.market_data = {}
        
        logger.info(f"Initialized agent: {name} with {len(strategies)} strategies")
    
    def _aggregate_signals_weighted(self, all_signals: List[Dict[str, str]]) -> Dict[str, str]:
        """Aggregate signals using weighted average."""
        final_signals = {}
        
        for symbol_key in all_signals[0].keys():
            # Convert signals to numeric values (-1 for sell, 0 for hold, 1 for buy)
            signal_values = {
                'sell': -1,
                'hold': 0,
                'buy': 1
            }
            
            weighted_sum = 0
            for signals, strategy in zip(all_signals, self.strategies):
                signal = signals.get(symbol_key, 'hold')
                weight = self.strategy_weights.get(strategy.name, 0)
                weighted_sum += signal_values[signal] * weight
            
            # Convert back to signal
            if weighted_sum > 0.3:  # Threshold for buy
                final_signals[symbol_key] = 'buy'
            elif weighted_sum < -0.3:  # Threshold for sell
                final_signals[symbol_key] = 'sell'
            else:
                final_signals[symbol_key] = 'hold'
                
        return final_signals

    def _aggregate_signals_consensus(self, all_signals: List[Dict[str, str]]) -> Dict[str, str]:
        """Aggregate signals requiring full consensus."""
        final_signals = {}
        
        for symbol_key in all_signals[0].keys():
            signals = [s.get(symbol_key, 'hold') for s in all_signals]
            
            if all(s == 'buy' for s in signals):
                final_signals[symbol_key] = 'buy'
            elif all(s == 'sell' for s in signals):
                final_signals[symbol_key] = 'sell'
            else:
                final_signals[symbol_key] = 'hold'
                
        return final_signals

    def _aggregate_signals_majority(self, all_signals: List[Dict[str, str]]) -> Dict[str, str]:
        """Aggregate signals using majority vote."""
        final_signals = {}
        
        for symbol_key in all_signals[0].keys():
            signals = [s.get(symbol_key, 'hold') for s in all_signals]
            
            buy_count = signals.count('buy')
            sell_count = signals.count('sell')
            hold_count = signals.count('hold')
            
            max_count = max(buy_count, sell_count, hold_count)
            
            if max_count == buy_count:
                final_signals[symbol_key] = 'buy'
            elif max_count == sell_count:
                final_signals[symbol_key] = 'sell'
            else:
                final_signals[symbol_key] = 'hold'
                
        return final_signals
    
    def execute_signals(self, signals: Dict[str, str]):
        """Execute trading signals across exchanges."""
        if not self.config['enable_trading']:
            logger.info("Trading is disabled. Signals generated but not executed.")
            return
        
        for symbol_key, signal in signals.items():
            if signal == 'hold':
                continue
                
            # Parse symbol and exchange from the key (format: "SYMBOL_EXCHANGEID")
            symbol, exchange_id = symbol_key.rsplit('_', 1)
            
            if exchange_id not in self.exchanges:
                logger.error(f"Unknown exchange ID: {exchange_id}")
                continue
                
            connector = self.exchanges[exchange_id]
            
            try:
                # Get current ticker data
                ticker = connector.get_ticker(symbol)
                if not ticker:
                    logger.error(f"Failed to get ticker for {symbol} on {exchange_id}")
                    continue
                
                # Get account balance
                balance = connector.get_balance()
                if not balance:
                    logger.error(f"Failed to get balance for {exchange_id}")
                    continue
                
                # Determine order parameters based on signal
                if signal == 'buy':
                    # Calculate order amount based on config and available balance
                    base_currency = symbol.split('/')[1]  # For symbol "BTC/USDT", base_currency is "USDT"
                    available_balance = balance.get('free', {}).get(base_currency, 0)
                    
                    # Limit order amount to configured maximum
                    order_amount_usd = min(available_balance, self.config['max_order_amount_usd'])
                    
                    if order_amount_usd > 0:
                        # Convert USD amount to asset quantity
                        price = ticker.get('last', 0)
                        if price > 0:
                            quantity = order_amount_usd / price
                            
                            # Place buy order
                            order_result = connector.place_order(
                                symbol=symbol,
                                order_type='market',
                                side='buy',
                                amount=quantity
                            )
                            
                            if order_result:
                                log_trade(logger, 'buy', f"Placed BUY order for {quantity} {symbol} on {exchange_id}")
                                
                                # Track the position
                                position_id = f"{symbol}_{exchange_id}_{order_result.get('id', datetime.now().timestamp())}"
                                self.positions[position_id] = {
                                    'symbol': symbol,
                                    'exchange_id': exchange_id,
                                    'entry_price': price,
                                    'quantity': quantity,
                                    'side': 'long',
                                    'entry_time': datetime.now().isoformat(),
                                    'order_id': order_result.get('id', '')
                                }
                    else:
                        logger.warning(f"Insufficient balance for {base_currency} on {exchange_id}")
                
                elif signal == 'sell':
                    # For selling, check if we have an open position
                    open_positions = [p for p in self.positions.values() 
                                     if p['symbol'] == symbol and p['exchange_id'] == exchange_id and p['side'] == 'long']
                    
                    if open_positions:
                        for position in open_positions:
                            # Place sell order
                            order_result = connector.place_order(
                                symbol=symbol,
                                order_type='market',
                                side='sell',
                                amount=position['quantity']
                            )
                            
                            if order_result:
                                log_trade(logger, 'sell', f"Placed SELL order for {position['quantity']} {symbol} on {exchange_id}")
                                
                                # Close the position
                                position_id = next((pid for pid, p in self.positions.items() if p == position), None)
                                if position_id:
                                    self.positions.pop(position_id)
                    else:
                        # Alternative: sell from available balance
                        quote_currency = symbol.split('/')[0]  # For symbol "BTC/USDT", quote_currency is "BTC"
                        available_balance = balance.get('free', {}).get(quote_currency, 0)
                        
                        if available_balance > 0:
                            # Place sell order
                            order_result = connector.place_order(
                                symbol=symbol,
                                order_type='market',
                                side='sell',
                                amount=available_balance
                            )
                            
                            if order_result:
                                log_trade(logger, 'sell', f"Placed SELL order for {available_balance} {symbol} on {exchange_id}")
                        else:
                            logger.warning(f"No {quote_currency} balance to sell on {exchange_id}")
            
            except Exception as e:
                logger.error(f"Error executing {signal} signal for {symbol} on {exchange_id}: {e}")
    
    def check_stop_loss_take_profit(self):
        """Check and execute stop loss and take profit orders for open positions."""
        if not self.config['enable_trading'] or not self.positions:
            return
        
        positions_to_close = []
        
        for position_id, position in self.positions.items():
            symbol = position['symbol']
            exchange_id = position['exchange_id']
            entry_price = position['entry_price']
            
            if exchange_id not in self.exchanges:
                continue
                
            connector = self.exchanges[exchange_id]
            
            # Get current price
            ticker = connector.get_ticker(symbol)
            if not ticker:
                continue
                
            current_price = ticker.get('last', 0)
            if current_price <= 0:
                continue
            
            # Calculate profit/loss percentage
            if position['side'] == 'long':
                pnl_pct = ((current_price - entry_price) / entry_price) * 100
            else:  # short position
                pnl_pct = ((entry_price - current_price) / entry_price) * 100
            
            # Check stop loss
            if pnl_pct <= -self.config['stop_loss_pct']:
                logger.info(f"Stop loss triggered for {symbol} on {exchange_id}: {pnl_pct:.2f}%")
                
                # Close position
                try:
                    order_result = connector.place_order(
                        symbol=symbol,
                        order_type='market',
                        side='sell' if position['side'] == 'long' else 'buy',
                        amount=position['quantity']
                    )
                    
                    if order_result:
                        logger.info(f"Executed stop loss for {position['quantity']} {symbol} on {exchange_id}")
                        positions_to_close.append(position_id)
                except Exception as e:
                    logger.error(f"Error executing stop loss for {symbol} on {exchange_id}: {e}")
            
            # Check take profit
            elif pnl_pct >= self.config['take_profit_pct']:
                logger.info(f"Take profit triggered for {symbol} on {exchange_id}: {pnl_pct:.2f}%")
                
                # Close position
                try:
                    order_result = connector.place_order(
                        symbol=symbol,
                        order_type='market',
                        side='sell' if position['side'] == 'long' else 'buy',
                        amount=position['quantity']
                    )
                    
                    if order_result:
                        logger.info(f"Executed take profit for {position['quantity']} {symbol} on {exchange_id}")
                        positions_to_close.append(position_id)
                except Exception as e:
                    logger.error(f"Error executing take profit for {symbol} on {exchange_id}: {e}")
        
        # Remove closed positions
        for position_id in positions_to_close:
            self.positions.pop(position_id, None)
    
    def run(self):
        """Main agent loop."""
        logger.info(f"Starting agent: {self.name}")
        
        while True:
            try:
                # Update market data
                self.update_market_data()
                
                # Generate signals from all strategies
                all_signals = []
                for strategy in self.strategies:
                    signals = strategy.generate_signals(self.market_data)
                    for symbol, signal in signals.items():
                        logger.log_trade(signal, f"Strategy {strategy.name} - {symbol}: {signal}")
                    all_signals.append(signals)
                
                # Aggregate signals based on selected mode
                if self.aggregation_mode == 'weighted':
                    final_signals = self._aggregate_signals_weighted(all_signals)
                elif self.aggregation_mode == 'consensus':
                    final_signals = self._aggregate_signals_consensus(all_signals)
                else:  # majority
                    final_signals = self._aggregate_signals_majority(all_signals)
                
                logger.info(f"Aggregated signals: {final_signals}")
                
                # Execute final signals
                self.execute_signals(final_signals)
                
                # Check stop loss and take profit
                self.check_stop_loss_take_profit()
                
                # Sleep until next update
                time.sleep(self.config['update_interval'])
                
            except KeyboardInterrupt:
                logger.info("Agent stopped by user")
                break
            except Exception as e:
                logger.error(f"Error in agent main loop: {e}")
                time.sleep(30)
    
    def save_state(self, filepath: str):
        """Save agent state to a file."""
        state = {
            'name': self.name,
            'strategy_names': [strategy.name for strategy in self.strategies],
            'strategy_weights': self.strategy_weights,
            'config': self.config,
            'positions': self.positions,
            'timestamp': datetime.now().isoformat()
        }
        
        try:
            with open(filepath, 'w') as f:
                json.dump(state, f, indent=2)
            logger.info(f"Agent state saved to: {filepath}")
        except Exception as e:
            logger.error(f"Error saving agent state: {e}")
    
    def load_state(self, filepath: str):
        """Load agent state from a file."""
        try:
            with open(filepath, 'r') as f:
                state = json.load(f)
            
            self.name = state.get('name', self.name)
            self.config = state.get('config', self.config)
            self.positions = state.get('positions', {})
            
            self.strategies = [strategy_name for strategy_name in state.get('strategy_names', [])]
            self.strategy_weights = state.get('strategy_weights', {})
            
            logger.info(f"Agent state loaded from: {filepath}")
        except Exception as e:
            logger.error(f"Error loading agent state: {e}")
