from abc import ABC, abstractmethod
from typing import Dict, List
import logging

logger = logging.getLogger("trading_agent")

class Strategy(ABC):
    """Base abstract class for trading strategies."""
    
    def __init__(self, name: str, symbols: List[str], params: Dict = None):
        """
        Initialize a trading strategy.
        
        Args:
            name: Strategy name
            symbols: List of trading pair symbols to trade
            params: Strategy-specific parameters
        """
        self.name = name
        self.symbols = symbols
        self.params = params or {}
        logger.info(f"Initialized strategy: {name} for symbols: {symbols}")
    
    @abstractmethod
    def generate_signals(self, market_data: Dict) -> Dict[str, str]:
        """
        Generate trading signals based on market data.
        
        Args:
            market_data: Dictionary containing market data by symbol
            
        Returns:
            Dictionary mapping symbols to signals ('buy', 'sell', 'hold')
        """
        pass