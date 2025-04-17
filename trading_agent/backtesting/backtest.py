import logging
from datetime import datetime
from typing import Dict, List, Optional

import numpy as np
import pandas as pd

from trading_agent import Agent
from utils.logger import log_trade, setup_logger

# Import MLOps utilities if available
try:
    from utils.mlflow import log_backtest_results
    MLFLOW_AVAILABLE = True
except ImportError:
    MLFLOW_AVAILABLE = False

logger = setup_logger("backtest")

class BacktestEngine:
    """Backtesting engine for trading strategies."""
    
    def __init__(
        self,
        agent: Agent,
        initial_balance: float = 10000,
        commission: float = 0.001,
        enable_mlflow: bool = True
    ):
        """
        Initialize backtest engine.
        
        Args:
            agent: Trading agent
            initial_balance: Initial account balance
            commission: Trading commission rate
            enable_mlflow: Enable MLflow tracking
        """
        self.agent = agent
        self.initial_balance = initial_balance
        self.commission = commission
        self.balance = initial_balance
        self.positions = {}
        self.trades = []
        self.equity_curve = []
        self.enable_mlflow = enable_mlflow and MLFLOW_AVAILABLE
        
    def run(
        self,
        historical_data: Dict[str, pd.DataFrame],
        start_date: str,
        end_date: str
    ):
        """
        Run backtest over historical data.
        
        Args:
            historical_data: Dictionary of historical data by symbol
            start_date: Start date for backtest
            end_date: End date for backtest
        """
        logger.info(f"Starting backtest from {start_date} to {end_date}")
        logger.info(f"Available symbols in historical data: {list(historical_data.keys())}")
        
        # Convert dates to datetime
        start_dt = pd.to_datetime(start_date)
        end_dt = pd.to_datetime(end_date)
        
        # Get all unique timestamps across all symbols
        all_timestamps = set()
        for symbol, df in historical_data.items():
            timestamps = df[(df['timestamp'] >= start_dt) & (df['timestamp'] <= end_dt)]['timestamp']
            all_timestamps.update(timestamps)
        
        # Sort timestamps
        dates = sorted(all_timestamps)
        logger.info(f"Backtest will run over {len(dates)} time points")
        
        # Initialize equity curve
        self.equity_curve = []
        
        for timestamp in dates:
            # Prepare market data for current timestamp
            current_data = {}
            for symbol, df in historical_data.items():
                mask = df['timestamp'] <= timestamp
                if mask.any():
                    current_data[symbol] = df[mask].copy()
            
            if not current_data:
                continue
                
            # Generate signals
            all_signals = []
            for strategy in self.agent.strategies:
                signals = strategy.generate_signals(current_data)
                logger.debug(f"Strategy {strategy.name} signals: {signals}")
                all_signals.append(signals)
            
            # Aggregate signals
            if self.agent.aggregation_mode == 'weighted':
                final_signals = self.agent._aggregate_signals_weighted(all_signals)
            elif self.agent.aggregation_mode == 'consensus':
                final_signals = self.agent._aggregate_signals_consensus(all_signals)
            else:
                final_signals = self.agent._aggregate_signals_majority(all_signals)
            
            logger.debug(f"Final signals for {timestamp}: {final_signals}")
            
            # Execute trades
            self._execute_signals(final_signals, current_data, timestamp)
            
            # Update equity curve
            total_equity = self._calculate_total_equity(current_data)
            self.equity_curve.append({
                'timestamp': timestamp,
                'equity': total_equity
            })
    
    def get_results(self) -> Dict:
        """
        Calculate and return backtest results.
        
        Returns:
            Dictionary of backtest results
        """
        equity_df = pd.DataFrame(self.equity_curve)
        equity_df.set_index('timestamp', inplace=True)
        
        returns = equity_df['equity'].pct_change()
        
        results = {
            'total_return': (equity_df['equity'].iloc[-1] / self.initial_balance - 1) * 100,
            'sharpe_ratio': self._calculate_sharpe_ratio(returns),
            'max_drawdown': self._calculate_max_drawdown(equity_df['equity']),
            'total_trades': len(self.trades),
            'win_rate': self._calculate_win_rate(),
            'equity_curve': equity_df
        }
        
        return results
    
    def log_to_mlflow(self, start_date: str, end_date: str) -> None:
        """
        Log backtest results to MLflow.
        
        Args:
            start_date: Start date of backtest
            end_date: End date of backtest
        """
        if not self.enable_mlflow:
            logger.warning("MLflow tracking is not enabled or available")
            return
        
        results = self.get_results()
        
        # Check if we have PEN strategies with MLflow run IDs
        for strategy in self.agent.strategies:
            if hasattr(strategy, 'name') and strategy.name == "PEN" and hasattr(strategy, 'mlflow_run_ids'):
                for symbol, run_id in strategy.mlflow_run_ids.items():
                    try:
                        log_backtest_results(
                            run_id=run_id,
                            symbol=symbol,
                            backtest_results=results,
                            start_date=start_date,
                            end_date=end_date
                        )
                        logger.info(f"Backtest results for {symbol} logged to MLflow run {run_id}")
                    except Exception as e:
                        logger.error(f"Error logging backtest results to MLflow: {e}")

    def _execute_signals(self, signals: Dict, market_data: Dict, timestamp: datetime):
        """
        Execute trading signals in backtest.
        
        Args:
            signals: Dictionary of trading signals by symbol
            market_data: Dictionary of market data by symbol
            timestamp: Current timestamp
        """
        for symbol, signal in signals.items():
            # Skip if we don't have market data for this symbol
            if symbol not in market_data:
                logger.warning(f"No market data for {symbol}, skipping signal execution")
                continue
            
            current_price = market_data[symbol]['close'].iloc[-1]
            
            if signal == 'buy' and symbol not in self.positions:
                # Calculate position size
                position_size = (self.balance * 0.1) / current_price  # Use 10% of balance
                cost = position_size * current_price * (1 + self.commission)
                
                if cost <= self.balance:
                    self.positions[symbol] = {
                        'entry_price': current_price,
                        'quantity': position_size,
                        'entry_time': timestamp
                    }
                    self.balance -= cost
                    
                    self.trades.append({
                        'symbol': symbol,
                        'type': 'buy',
                        'price': current_price,
                        'quantity': position_size,
                        'timestamp': timestamp,
                        'pnl': 0  # No PnL for buy trades
                    })
                    log_trade(logger, 'buy', f"Executed BUY for {symbol} at {current_price}, quantity: {position_size:.6f}, cost: {cost:.2f}")
            
            elif signal == 'sell' and symbol in self.positions:
                position = self.positions[symbol]
                proceeds = position['quantity'] * current_price * (1 - self.commission)
                pnl = proceeds - (position['quantity'] * position['entry_price'])
                self.balance += proceeds
                
                self.trades.append({
                    'symbol': symbol,
                    'type': 'sell',
                    'price': current_price,
                    'quantity': position['quantity'],
                    'timestamp': timestamp,
                    'pnl': pnl
                })
                
                log_trade(logger, 'sell', f"Executed SELL for {symbol} at {current_price}, quantity: {position['quantity']:.6f}, PnL: {pnl:.2f}")
                
                # Remove the position
                del self.positions[symbol]
            
            # For 'hold' signals, we do nothing
    
    def _calculate_total_equity(self, market_data: Dict) -> float:
        """Calculate total equity including open positions."""
        equity = self.balance
        
        for symbol, position in self.positions.items():
            current_price = market_data[symbol]['close'].iloc[-1]
            equity += position['quantity'] * current_price
            
        return equity
    
    def _calculate_sharpe_ratio(self, returns: pd.Series) -> float:
        """
        Calculate Sharpe ratio.
        
        Args:
            returns: Series of returns
            
        Returns:
            Sharpe ratio or 0.0 if not calculable
        """
        if len(returns) < 2:
            return 0.0
        
        std = returns.std()
        if std == 0 or pd.isna(std):
            logger.warning("Standard deviation of returns is zero or NaN. Cannot calculate Sharpe ratio.")
            return 0.0
        
        return np.sqrt(252) * returns.mean() / std
    
    def _calculate_max_drawdown(self, equity: pd.Series) -> float:
        """Calculate maximum drawdown."""
        rolling_max = equity.expanding().max()
        drawdowns = equity / rolling_max - 1
        return drawdowns.min() * 100
    
    def _calculate_win_rate(self) -> float:
        """Calculate win rate from completed trades."""
        if not self.trades:
            return 0.0
        
        profitable_trades = sum(1 for trade in self.trades if trade.get('pnl', 0) > 0)
        return (profitable_trades / len(self.trades)) * 100