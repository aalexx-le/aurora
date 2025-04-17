"""
Grid Backtesting System: Run backtests in monthly grids for ETH
"""

import calendar
from datetime import datetime, timedelta
from typing import Dict, List, Tuple

import matplotlib.pyplot as plt
import pandas as pd

from agent_factory import create_default_agent
from backtesting.backtest import BacktestEngine
from backtesting.data_loader import HistoricalDataLoader
from strategy.MovingAverage import MovingAverageStrategy
from strategy.PEN import PENStrategy
from strategy.RSI import RSIStrategy
from utils.logger import setup_logger

# Configure logging
logger = setup_logger("grid_backtest")

def generate_monthly_grids(start_date: str, end_date: str) -> List[Tuple[str, str]]:
    """Generate monthly time grids between start and end dates."""
    start = datetime.strptime(start_date, '%Y-%m-%d')
    end = datetime.strptime(end_date, '%Y-%m-%d')
    
    grids = []
    current = start
    
    while current < end:
        # Get last day of current month
        _, last_day = calendar.monthrange(current.year, current.month)
        month_end = min(
            datetime(current.year, current.month, last_day),
            end
        )
        
        grids.append((
            current.strftime('%Y-%m-%d'),
            month_end.strftime('%Y-%m-%d')
        ))
        
        # Move to first day of next month
        if current.month == 12:
            current = datetime(current.year + 1, 1, 1)
        else:
            current = datetime(current.year, current.month + 1, 1)
    
    return grids

def run_grid_backtest(
    start_date: str,
    end_date: str,
    initial_balance: float = 10000
) -> Dict:
    """Run backtests on monthly grids."""
    # Create agent with only ETH
    agent = create_default_agent()
    agent.strategies[0].symbols = ['ETH/USDT']  # Override symbols
    
    # Generate monthly grids
    grids = generate_monthly_grids(start_date, end_date)
    
    # Store results for each grid
    grid_results = []
    
    for grid_start, grid_end in grids:
        logger.info(f"\nRunning backtest for period: {grid_start} to {grid_end}")
        
        # Load data and run backtest
        data_loader = HistoricalDataLoader()
        historical_data = data_loader.fetch_historical_data(
            symbols=['ETH/USDT'],
            start_date=grid_start,
            end_date=grid_end
        )
        
        backtest = BacktestEngine(agent, initial_balance=initial_balance)
        backtest.run(historical_data, grid_start, grid_end)
        results = backtest.get_results()
        
        # Store results
        grid_results.append({
            'period': f"{grid_start} to {grid_end}",
            'total_return': results['total_return'],
            'sharpe_ratio': results['sharpe_ratio'],
            'max_drawdown': results['max_drawdown'],
            'win_rate': results['win_rate'],
            'total_trades': results['total_trades']
        })
        
        # Log results
        logger.info(f"Grid Results:")
        logger.info(f"Total Return: {results['total_return']:.2f}%")
        logger.info(f"Sharpe Ratio: {results['sharpe_ratio']:.2f}")
        logger.info(f"Max Drawdown: {results['max_drawdown']:.2f}%")
        logger.info(f"Win Rate: {results['win_rate']:.2f}%")
        logger.info(f"Total Trades: {results['total_trades']}")
    
    # Create summary DataFrame
    summary_df = pd.DataFrame(grid_results)
    
    # Plot grid returns
    plt.figure(figsize=(12, 6))
    plt.bar(range(len(grid_results)), summary_df['total_return'])
    plt.xticks(range(len(grid_results)), summary_df['period'], rotation=45)
    plt.title('Monthly Grid Returns')
    plt.ylabel('Return (%)')
    plt.tight_layout()
    plt.show()
    
    return {
        'grid_results': grid_results,
        'summary': {
            'avg_return': summary_df['total_return'].mean(),
            'avg_sharpe': summary_df['sharpe_ratio'].mean(),
            'avg_drawdown': summary_df['max_drawdown'].mean(),
            'avg_win_rate': summary_df['win_rate'].mean(),
            'total_trades': summary_df['total_trades'].sum()
        }
    }

if __name__ == "__main__":
    # Example usage
    results = run_grid_backtest(
        start_date='2024-01-01',
        end_date='2024-03-01',
        initial_balance=10000
    )
    
    print("\nOverall Summary:")
    print(f"Average Monthly Return: {results['summary']['avg_return']:.2f}%")
    print(f"Average Sharpe Ratio: {results['summary']['avg_sharpe']:.2f}")
    print(f"Average Max Drawdown: {results['summary']['avg_drawdown']:.2f}%")
    print(f"Average Win Rate: {results['summary']['avg_win_rate']:.2f}%")
    print(f"Total Trades: {results['summary']['total_trades']}")    