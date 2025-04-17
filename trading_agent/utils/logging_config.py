"""
Centralized logging configuration
"""
import logging
import colorlog

def configure_root_logger() -> None:
    """Configure the root logger with colored output."""
    root_logger = logging.getLogger()
    
    if not root_logger.handlers:
        root_logger.setLevel(logging.INFO)
        
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
        root_logger.addHandler(console_handler)

def get_logger(name: str) -> logging.Logger:
    """Get a logger with the specified name."""
    return logging.getLogger(name)