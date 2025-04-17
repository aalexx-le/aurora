"""
Multi-Exchange Trading Agent System: Entry point for trading and backtesting
"""

import argparse
import logging
from datetime import datetime

import matplotlib.pyplot as plt

from agent_factory import create_agent_from_config, create_default_agent
from backtesting.backtest import BacktestEngine
from backtesting.data_loader import HistoricalDataLoader
from utils.logger import setup_logger

# Import MLOps utilities if available
try:
    from utils.mlflow import setup_mlflow
    MLFLOW_AVAILABLE = True
except ImportError:
    MLFLOW_AVAILABLE = False

# Configure logging
logger = setup_logger(__name__)

def run_live_trading(agent):
    """Run the agent in live trading mode."""
    try:
        logger.info("Starting live trading...")
        agent.run()
    except KeyboardInterrupt:
        logger.info("Trading stopped by user")
    except Exception as e:
        logger.error(f"Error during trading: {e}")
    finally:
        pass

def run_backtest(agent, start_date: str, end_date: str, enable_mlflow: bool = True):
    """
    Run backtest for the trading agent.
    
    Args:
        agent: Trading agent instance
        start_date: Start date in YYYY-MM-DD format
        end_date: End date in YYYY-MM-DD format
        enable_mlflow: Enable MLflow tracking
    """
    data_loader = HistoricalDataLoader()
    
    # Fetch data for all symbols across all exchanges
    historical_data = {}
    for symbol in agent.strategies[0].symbols:
        data = data_loader.fetch_historical_data(
            symbols=[symbol],
            start_date=start_date,
            end_date=end_date
        )
        if data and symbol in data:
            # Store with the exchange suffix to match signal keys
            historical_data[symbol] = data[symbol]
            logger.info(f"Loaded historical data for {symbol}: {len(data[symbol])} records")
    
    if not historical_data:
        logger.error("No historical data loaded. Cannot run backtest.")
        return
        
    backtest = BacktestEngine(
        agent=agent,
        initial_balance=10000,
        commission=0.001,
        enable_mlflow=enable_mlflow
    )
    
    backtest.run(historical_data, start_date, end_date)
    results = backtest.get_results()
    
    # Log to MLflow if enabled
    if enable_mlflow and MLFLOW_AVAILABLE:
        backtest.log_to_mlflow(start_date, end_date)
    
    # Print results
    print("\nBacktest Results:")
    print(f"Total Return: {results['total_return']:.2f}%")
    print(f"Sharpe Ratio: {results['sharpe_ratio']:.2f}")
    print(f"Max Drawdown: {results['max_drawdown']:.2f}%")
    print(f"Total Trades: {results['total_trades']}")
    print(f"Win Rate: {results['win_rate']:.2f}%")
    
    # Plot equity curve
    plt.figure(figsize=(12, 6))
    results['equity_curve'].plot(title='Equity Curve')
    plt.xlabel('Date')
    plt.ylabel('Portfolio Value ($)')
    plt.grid(True)
    plt.show()

def main():
    parser = argparse.ArgumentParser(description="Trading Agent CLI")
    parser.add_argument("--mode", choices=['live', 'backtest'], required=True)
    parser.add_argument("--config", help="Path to configuration file")
    parser.add_argument("--start-date", help="Backtest start date (YYYY-MM-DD)")
    parser.add_argument("--end-date", help="Backtest end date (YYYY-MM-DD)")
    parser.add_argument("--mlflow", action="store_true", help="Enable MLflow tracking")
    
    args = parser.parse_args()
    
    # Setup MLflow if enabled
    if args.mlflow and MLFLOW_AVAILABLE:
        setup_mlflow()
    
    # Create agent
    agent = create_agent_from_config(args.config) if args.config else create_default_agent()
    
    if args.mode == 'live':
        run_live_trading(agent)
    else:  # backtest mode
        if not (args.start_date and args.end_date):
            parser.error("Backtest mode requires --start-date and --end-date")
        run_backtest(agent, args.start_date, args.end_date, enable_mlflow=args.mlflow)

if __name__ == "__main__":
    main()