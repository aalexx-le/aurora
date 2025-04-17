import pandas as pd
from typing import Dict, List
from strategy.index import Strategy

class RSIStrategy(Strategy):
    """Relative Strength Index (RSI) strategy."""
    
    def __init__(self, symbols: List[str], period: int = 14, oversold: int = 30, overbought: int = 70):
        """
        Initialize the RSI strategy.
        
        Args:
            symbols: List of trading pair symbols
            period: RSI calculation period
            oversold: Oversold threshold (buy signal)
            overbought: Overbought threshold (sell signal)
        """
        params = {
            'period': period,
            'oversold': oversold,
            'overbought': overbought
        }
        super().__init__("RSI", symbols, params)
    
    def _calculate_rsi(self, data: pd.DataFrame) -> pd.Series:
        """Calculate RSI indicator."""
        delta = data['close'].diff()
        gain = delta.where(delta > 0, 0)
        loss = -delta.where(delta < 0, 0)
        
        avg_gain = gain.rolling(window=self.params['period']).mean()
        avg_loss = loss.rolling(window=self.params['period']).mean()
        
        rs = avg_gain / avg_loss
        rsi = 100 - (100 / (1 + rs))
        
        return rsi
    
    def generate_signals(self, market_data: Dict) -> Dict[str, str]:
        """Generate signals based on RSI levels."""
        signals = {}
        
        for symbol, data in market_data.items():
            if symbol not in self.symbols:
                continue
                
            if isinstance(data, pd.DataFrame) and not data.empty and len(data) >= self.params['period'] + 1:
                # Calculate RSI
                data['rsi'] = self._calculate_rsi(data)
                
                if pd.notna(data['rsi'].iloc[-1]):
                    current_rsi = data['rsi'].iloc[-1]
                    
                    # Generate signals based on RSI levels
                    if current_rsi < self.params['oversold']:
                        signals[symbol] = 'buy'  # Oversold condition
                    elif current_rsi > self.params['overbought']:
                        signals[symbol] = 'sell'  # Overbought condition
                    else:
                        signals[symbol] = 'hold'  # Neutral
                else:
                    signals[symbol] = 'hold'  # Not enough data for RSI
            else:
                signals[symbol] = 'hold'  # Invalid data
                
        return signals