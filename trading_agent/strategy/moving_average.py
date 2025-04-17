import pandas as pd
from typing import Dict, List
from strategy.index import Strategy

class MovingAverageStrategy(Strategy):
    """Simple moving average crossover strategy."""
    
    def __init__(self, symbols: List[str], fast_period: int = 10, slow_period: int = 50):
        """
        Initialize the MA crossover strategy.
        
        Args:
            symbols: List of trading pair symbols
            fast_period: Fast moving average period
            slow_period: Slow moving average period
        """
        params = {
            'fast_period': fast_period,
            'slow_period': slow_period
        }
        super().__init__("MA_Crossover", symbols, params)
    
    def generate_signals(self, market_data: Dict) -> Dict[str, str]:
        """Generate signals based on MA crossover."""
        signals = {}
        
        for symbol, data in market_data.items():
            if symbol not in self.symbols:
                continue
                
            if isinstance(data, pd.DataFrame) and not data.empty:
                # Calculate moving averages
                data['fast_ma'] = data['close'].rolling(self.params['fast_period']).mean()
                data['slow_ma'] = data['close'].rolling(self.params['slow_period']).mean()
                
                # Generate signals based on crossover
                if len(data) >= self.params['slow_period'] + 2:  # Need at least slow_period + 2 data points
                    current = data.iloc[-1]
                    previous = data.iloc[-2]
                    
                    # Check for crossover
                    if current['fast_ma'] > current['slow_ma'] and previous['fast_ma'] <= previous['slow_ma']:
                        signals[symbol] = 'buy'  # Bullish crossover
                    elif current['fast_ma'] < current['slow_ma'] and previous['fast_ma'] >= previous['slow_ma']:
                        signals[symbol] = 'sell'  # Bearish crossover
                    else:
                        signals[symbol] = 'hold'  # No crossover
                else:
                    signals[symbol] = 'hold'  # Not enough data
            else:
                signals[symbol] = 'hold'  # Invalid data
                
        return signals