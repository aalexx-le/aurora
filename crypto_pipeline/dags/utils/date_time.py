
from datetime import datetime


def timestamp_to_date(timestamp: str):
    return datetime.fromtimestamp(timestamp=int(timestamp) / 1e3)