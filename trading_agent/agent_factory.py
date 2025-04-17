"""
Factory module for creating trading agents with different configurations
"""

import json
import os
from typing import Dict, List

from dotenv import load_dotenv

from strategy import MovingAverageStrategy, PENStrategy, RSIStrategy
from trading_agent import Agent, ExchangeConnector

# Load environment variables
load_dotenv()

def create_exchange_connectors() -> Dict[str, ExchangeConnector]:
    """Create exchange connectors using environment variables."""
    return {
        'binance': ExchangeConnector(
            exchange_id='binance',
            api_key=os.getenv('BINANCE_API_KEY'),
            secret=os.getenv('BINANCE_SECRET')
        ),
        'okx': ExchangeConnector(
            exchange_id='okx',
            api_key=os.getenv('OKX_API_KEY'),
            secret=os.getenv('OKX_SECRET'),
            additional_params={'password': os.getenv('OKX_PASSWORD')}
        ),
        'mexc': ExchangeConnector(
            exchange_id='mexc',
            api_key=os.getenv('MEXC_API_KEY'),
            secret=os.getenv(key='MEXC_SECRET')
        )
    }

def create_default_agent() -> Agent:
    """Create a default trading agent with multiple strategies."""
    exchanges = create_exchange_connectors()
    symbols = ['BTC/USDT', 'ETH/USDT']
    
    strategies = [
        MovingAverageStrategy(symbols=symbols, fast_period=10, slow_period=50),
        RSIStrategy(symbols=symbols, period=14, oversold=30, overbought=70),
        PENStrategy(symbols=symbols)
    ]
    
    strategy_weights = {
        'MA_Crossover': 0.3,
        'RSI': 0.3,
        'PEN_DeepLearning': 0.4
    }
    
    return Agent(
        name="MultiStrategyAgent",
        exchanges=exchanges,
        strategies=strategies,
        strategy_weights=strategy_weights,
        aggregation_mode='weighted',
        config={
            'max_order_amount_usd': 100,
            'enable_trading': False,
            'update_interval': 300,
            'stop_loss_pct': 5,
            'take_profit_pct': 15
        }
    )

def create_agent_from_config(config_path: str) -> Agent:
    """
    Create an agent from configuration file.
    
    Args:
        config_path: Path to JSON configuration file
    
    Returns:
        Configured trading agent
    """
    # Load config file
    with open(config_path, 'r') as f:
        config = json.loads(f.read())
    
    exchanges = create_exchange_connectors()
    
    strategies = []
    strategy_weights = {}
    
    for strategy_config in config["strategies"]:
        strategy_type = strategy_config["type"]
        params = strategy_config["params"]
        
        if strategy_type == "moving_average":
            strategy = MovingAverageStrategy(
                symbols=config["symbols"],
                fast_period=params.get("fast_period", 10),
                slow_period=params.get("slow_period", 50)
            )
        elif strategy_type == "rsi":
            strategy = RSIStrategy(
                symbols=config["symbols"],
                period=params.get("period", 14),
                oversold=params.get("oversold", 30),
                overbought=params.get("overbought", 70)
            )
        elif strategy_type == "pen":
            strategy = PENStrategy(
                symbols=config["symbols"],
                seq_length=params.get("seq_length", 20),
                target_horizon=params.get("target_horizon", 1),
                device="cuda"
            )
        
        strategies.append(strategy)
        strategy_weights[strategy.name] = strategy_config.get("weight", 1.0)
    
    return Agent(
        name=config["agent_name"],
        exchanges=exchanges,
        strategies=strategies,
        strategy_weights=strategy_weights,
        aggregation_mode=config.get("aggregation_mode", "weighted"),
        config=config["trading_config"]
    )