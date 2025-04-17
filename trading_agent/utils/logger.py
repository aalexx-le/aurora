"""
Custom logging utility with colored output
"""

import logging

import colorlog


def setup_logger(name: str = "trading_agent") -> logging.Logger:
    """
    Set up a logger with colored output.
    
    Args:
        name: Logger name
        
    Returns:
        Configured logger instance
    """
    # Create logger
    logger = logging.getLogger(name)
    
    # Prevent propagation to the root logger
    logger.propagate = False
    
    # Only add handler if the logger doesn't already have handlers
    if not logger.handlers:
        logger.setLevel(logging.INFO)
        
        # Create console handler with colored formatter
        console_handler = colorlog.StreamHandler()
        console_handler.setLevel(logging.INFO)
        
        # Create colored formatter
        formatter = colorlog.ColoredFormatter(
            "%(log_color)s%(asctime)s - %(name)s - %(levelname)s - %(message)s",
            log_colors={
                'DEBUG': 'cyan',
                'INFO': 'white',
                'WARNING': 'yellow',
                'ERROR': 'red',
                'CRITICAL': 'red,bg_white',
                'TRADE_BUY': 'green',
                'TRADE_SELL': 'red',
                'TRADE_HOLD': 'grey'
            },
            secondary_log_colors={},
            style='%'
        )
        
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)
    
    return logger

# Create custom log levels for trades
logging.addLevelName(25, 'TRADE_BUY')
logging.addLevelName(26, 'TRADE_SELL')
logging.addLevelName(27, 'TRADE_HOLD')

def log_trade(logger: logging.Logger, signal: str, message: str):
    """
    Log trading signals with appropriate colors.
    
    Args:
        logger: Logger instance
        signal: Trading signal ('buy', 'sell', 'hold')
        message: Log message
    """
    level_map = {
        'buy': 25,  # TRADE_BUY level
        'sell': 26,  # TRADE_SELL level
        'hold': 27   # TRADE_HOLD level
    }
    logger.log(level_map[signal], message)