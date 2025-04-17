import logging
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Union

import ccxt
import pandas as pd
import psycopg
import torch
from psycopg.rows import dict_row
from torch.utils.data import DataLoader, Dataset

logger = logging.getLogger(__name__)


class OHLCVDataset(Dataset):
    """PyTorch Dataset for OHLCV financial data."""
    
    def __init__(self, data: pd.DataFrame, seq_length: int = 1):
        """
        Initialize OHLCV dataset.
        
        Args:
            data: DataFrame containing OHLCV data
            seq_length: Length of sequences to return (default: 1)
        """
        self.data = data
        self.seq_length = seq_length
        
        # Convert timestamp to datetime if it's not already
        if not pd.api.types.is_datetime64_any_dtype(data['timestamp']):
            self.data['timestamp'] = pd.to_datetime(self.data['timestamp'])
            
        # Sort by timestamp
        self.data = self.data.sort_values('timestamp')
        
        # Convert to numpy arrays for faster access
        self.timestamps = self.data['timestamp'].values
        self.features = self.data[['open', 'high', 'low', 'close', 'volume']].values
        
    def __len__(self) -> int:
        """Return the number of data points in the dataset."""
        if self.seq_length > 1:
            return max(0, len(self.data) - self.seq_length + 1)
        return len(self.data)
    
    def __getitem__(self, idx: int) -> Dict[str, torch.Tensor]:
        """
        Get a data point or sequence from the dataset.
        
        Args:
            idx: Index of the data point
            
        Returns:
            Dictionary with timestamp and OHLCV tensors
        """
        if self.seq_length > 1:
            # Return a sequence
            features = self.features[idx:idx+self.seq_length]
            timestamp = self.timestamps[idx+self.seq_length-1]  # Last timestamp in sequence
        else:
            # Return a single data point
            features = self.features[idx]
            timestamp = self.timestamps[idx]
            
        return {
            'timestamp': timestamp,
            'features': torch.FloatTensor(features)
        }


class HistoricalDataLoader:
    """Loads and prepares historical data for backtesting from database and exchange."""
    
    def __init__(
        self, 
        exchange_id: str = 'binance',
        db_url: str = ""
    ):
        """
        Initialize the historical data loader.
        
        Args:
            exchange_id: The ID of the exchange to use (default: 'binance')
            db_url: Database connection URL (default: empty, will use env var)
        """
        self.exchange = getattr(ccxt, exchange_id)()
        self.exchange_id = exchange_id
        _db_url = db_url or os.getenv("DATABASE_URL")
        if not _db_url:
            raise ValueError("Database URL must be provided either through constructor or DATABASE_URL environment variable")
        
        self.conn = self._get_db_connection(_db_url)

    def _get_db_connection(self, db_url: str) -> psycopg.Connection:
        """
        Create a database connection.
        
        Args:
            db_url: Database connection URL
            
        Returns:
            Database connection object
        """
        return psycopg.connect(db_url)

    def _get_asset_info_id(self, symbol: str) -> Optional[str]:
        """
        Get asset info ID for a symbol.
        
        Args:
            symbol: Trading pair symbol (e.g., 'BTC' for BTC/USDT)
            
        Returns:
            Optional[str]: Asset info ID if found
        """
        with self.conn.cursor() as cursor:
            cursor.execute("""
                SELECT id 
                FROM "AssetInfo" 
                WHERE symbol = %s
            """, (symbol,))
            result = cursor.fetchone()
            return result[0] if result else None

    def _get_db_data(
        self,
        asset_info_id: str,
        start_timestamp: int,
        end_timestamp: int,
        timeframe: str = '1m'
    ) -> pd.DataFrame:
        """
        Get historical data from database.
        
        Args:
            asset_info_id: Asset info ID
            start_timestamp: Start timestamp in milliseconds
            end_timestamp: End timestamp in milliseconds
            timeframe: Data timeframe
            
        Returns:
            pd.DataFrame: Historical price data
        """
        with self.conn.cursor(row_factory=dict_row) as cursor:
            # Convert timestamps to local time (Vietnam UTC+7) for database query
            start_time = datetime.fromtimestamp(start_timestamp / 1000).strftime('%Y-%m-%d %H:%M:%S')
            end_time = datetime.fromtimestamp(end_timestamp / 1000).strftime('%Y-%m-%d %H:%M:%S')
            
            cursor.execute("""
                SELECT 
                    "open_time" as timestamp,
                    "openPrice" as open,
                    "highPrice" as high,
                    "lowPrice" as low,
                    "closePrice" as close,
                    volume
                FROM "AssetPrice"
                WHERE "assetInfoId" = %s
                AND interval = %s
                AND open_time BETWEEN %s AND %s
                ORDER BY open_time ASC
            """, (
                asset_info_id,
                timeframe,
                start_time,
                end_time
            ))
            
            rows = cursor.fetchall()
            
            if len(rows) == 0:
                return pd.DataFrame()
            
            row_start_timestamp = rows[0]['timestamp']
            row_end_timestamp = rows[-1]['timestamp']
            
            logger.info(f"Fetched {len(rows)} rows starting from {row_start_timestamp} to {row_end_timestamp} from database")
            
            if not rows:
                return pd.DataFrame()
                
            df = pd.DataFrame(rows)
            
            # Convert timestamp to datetime with Vietnam timezone
            df['timestamp'] = pd.to_datetime(df['timestamp'])
            
            return df

    def _insert_ohlcv_data(
        self,
        asset_info_id: str,
        timeframe: str,
        ohlcv_data: List[List]
    ) -> None:
        """
        Insert OHLCV data into database.
        
        Args:
            asset_info_id: Asset info ID
            timeframe: Data timeframe
            ohlcv_data: List of OHLCV data points
        """
        with self.conn.cursor() as cursor:
            for candle in ohlcv_data:
                timestamp, open_, high, low, close, volume = candle
                data = {
                    "assetInfoId": asset_info_id,
                    "interval": timeframe,
                    "open_time": datetime.fromtimestamp(timestamp / 1000),
                    "close_time": datetime.fromtimestamp(timestamp / 1000),
                    "openPrice": float(open_),
                    "closePrice": float(close),
                    "highPrice": float(high),
                    "lowPrice": float(low),
                    "volume": float(volume)
                }
                
                cursor.execute("""
                    INSERT INTO "AssetPrice" (
                        "assetInfoId", interval, open_time, close_time,
                        "openPrice", "closePrice", "highPrice", "lowPrice", volume
                    )
                    VALUES (
                        %(assetInfoId)s, %(interval)s, %(open_time)s, %(close_time)s,
                        %(openPrice)s, %(closePrice)s, %(highPrice)s, %(lowPrice)s, %(volume)s
                    )
                    ON CONFLICT ("assetInfoId", open_time) DO NOTHING
                """, data)
            
            self.conn.commit()

    def fetch_historical_data(
        self,
        symbols: List[str],
        start_date: str,
        end_date: str,
        timeframe: str = '1m',
        batch_size: int = 128,
        seq_length: int = 1,
        as_dataloader: bool = True
    ) -> Dict[str, Union[pd.DataFrame, DataLoader]]:
        """
        Fetch historical OHLCV data for multiple symbols from database and exchange.
        
        Args:
            symbols: List of trading pairs (e.g., ['BTC/USDT', 'ETH/USDT'])
            start_date: Start date in 'YYYY-MM-DD' format
            end_date: End date in 'YYYY-MM-DD' format
            timeframe: Data timeframe ('1m', '5m', '1h', '1d')
            batch_size: Batch size for DataLoader (only used if as_dataloader=True)
            seq_length: Length of sequences to return (only used if as_dataloader=True)
            as_dataloader: If True, return PyTorch DataLoader objects instead of DataFrames
            
        Returns:
            Dict[str, Union[pd.DataFrame, DataLoader]]: Dictionary mapping symbols to their data
        """
        historical_data = {}
        start_timestamp = int(datetime.strptime(start_date, '%Y-%m-%d').timestamp() * 1000)
        end_timestamp = int(datetime.strptime(end_date, '%Y-%m-%d').timestamp() * 1000)
        
        for symbol_pair in symbols:
            base_symbol = symbol_pair.split('/')[0]  # Extract base symbol (e.g., 'BTC' from 'BTC/USDT')
            
            logger.info(f"Processing data for {base_symbol}...")
            
            asset_info_id = self._get_asset_info_id(base_symbol)
            if not asset_info_id:
                logger.warning(f"No asset info found for {base_symbol}")
                continue
                
            # Get data from database
            df = self._get_db_data(
                asset_info_id,
                start_timestamp,
                end_timestamp,
                timeframe
            )
            
            logger.info(f"Fetched {len(df)} rows from database for {symbol_pair}")
            
            # If we have gaps or missing data, fetch from exchange
            if len(df) == 0:
                logger.info(f"No data in database for {symbol_pair}, fetching from exchange...")
                ohlcv_data = self._fetch_all_ohlcv(
                    symbol_pair,
                    timeframe,
                    start_timestamp,
                    end_timestamp
                )
                
                if ohlcv_data:
                    # Insert into database
                    self._insert_ohlcv_data(asset_info_id, timeframe, ohlcv_data)
                    
                    # Convert to DataFrame
                    df = pd.DataFrame(
                        ohlcv_data,
                        columns=['timestamp', 'open', 'high', 'low', 'close', 'volume']
                    )
                    df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
            
            if len(df) > 0:
                expected_points = self._calculate_expected_data_points(start_date, end_date, timeframe)
                actual_points = len(df)
                
                if actual_points < expected_points:
                    logger.info(
                        f"Retrieved fewer points than expected for {symbol_pair}. "
                        f"Got {actual_points}, expected {expected_points}"
                    )
                    df = self._fetch_missing_data(
                        df,
                        symbol_pair,
                        asset_info_id,
                        start_timestamp,
                        end_timestamp,
                        timeframe
                    )
                
                if as_dataloader:
                    # Convert DataFrame to PyTorch Dataset and DataLoader
                    dataset = OHLCVDataset(df, seq_length=seq_length)
                    dataloader = DataLoader(
                        dataset, 
                        batch_size=batch_size,
                        shuffle=False,
                        num_workers=0,  # Use 0 for main process loading
                        pin_memory=True  # Faster data transfer to GPU if used
                    )
                    historical_data[symbol_pair] = dataloader
                else:
                    historical_data[symbol_pair] = df
            
        return historical_data
    
    def _fetch_all_ohlcv(
        self, 
        symbol: str, 
        timeframe: str, 
        since: int, 
        until: int, 
        limit: int = 1000
    ) -> List:
        """
        Fetch all OHLCV data for a symbol within a date range using pagination.
        
        Args:
            symbol: Trading pair symbol
            timeframe: Data timeframe ('1m', '5m', '1h', '1d')
            since: Start timestamp in milliseconds
            until: End timestamp in milliseconds
            limit: Maximum number of candles per request
            
        Returns:
            List: Combined OHLCV data for the entire date range
        """
        all_ohlcv = []
        current_since = since
        
        # Get timeframe in milliseconds to calculate pagination
        timeframe_ms = self._get_timeframe_ms(timeframe)
        
        while current_since < until:
            try:
                # Fetch a batch of data
                ohlcv_chunk = self.exchange.fetch_ohlcv(
                    symbol=symbol,
                    timeframe=timeframe,
                    since=current_since,
                    limit=limit
                )
                
                if not ohlcv_chunk or len(ohlcv_chunk) == 0:
                    # No more data available
                    break
                
                # Add the chunk to our result
                all_ohlcv.extend(ohlcv_chunk)
                
                # Update the since parameter for the next iteration
                # Use the timestamp of the last candle plus one timeframe interval
                last_timestamp = ohlcv_chunk[-1][0]
                current_since = last_timestamp + timeframe_ms
                
                # If we got fewer candles than the limit, we've reached the end
                if len(ohlcv_chunk) < limit:
                    break
                    
                # Add a small delay to avoid rate limiting if needed
                # time.sleep(self.exchange.rateLimit / 1000)  # Uncomment if needed
                
            except Exception as e:
                logger.error(f"Error during pagination for {symbol}: {e}")
                break
                
        return all_ohlcv
    
    def _get_timeframe_ms(self, timeframe: str) -> int:
        """
        Convert a timeframe string to milliseconds.
        
        Args:
            timeframe: Timeframe string (e.g., '1m', '5m', '1h', '1d')
            
        Returns:
            int: Timeframe in milliseconds
        """
        # Parse the timeframe string
        unit = timeframe[-1]
        value = int(timeframe[:-1])
        
        # Convert to milliseconds
        if unit == 'm':
            return value * 60 * 1000
        elif unit == 'h':
            return value * 60 * 60 * 1000
        elif unit == 'd':
            return value * 24 * 60 * 60 * 1000
        elif unit == 'w':
            return value * 7 * 24 * 60 * 60 * 1000
        else:
            raise ValueError(f"Unsupported timeframe unit: {unit}")

    def _calculate_expected_data_points(
        self,
        start_date: str,
        end_date: str,
        timeframe: str
    ) -> int:
        """
        Calculate expected number of data points between start and end dates for given timeframe.
        
        Args:
            start_date: Start date in 'YYYY-MM-DD' format
            end_date: End date in 'YYYY-MM-DD' format
            timeframe: Data timeframe ('1m', '5m', '1h', '1d')
            
        Returns:
            int: Expected number of data points
        """
        start = datetime.strptime(start_date, '%Y-%m-%d')
        end = datetime.strptime(end_date, '%Y-%m-%d')
        duration = end - start
        
        # Convert timeframe to timedelta
        unit = timeframe[-1]
        value = int(timeframe[:-1])
        
        if unit == 'm':
            interval = timedelta(minutes=value)
        elif unit == 'h':
            interval = timedelta(hours=value) 
        elif unit == 'd':
            interval = timedelta(days=value)
        elif unit == 'w':
            interval = timedelta(weeks=value)
        else:
            raise ValueError(f"Unsupported timeframe unit: {unit}")
        
        # Calculate number of intervals
        return int(duration / interval)

    def _fetch_missing_data(
        self,
        df: pd.DataFrame,
        symbol_pair: str,
        asset_info_id: str,
        start_timestamp: int,
        end_timestamp: int,
        timeframe: str
    ) -> pd.DataFrame:
        """
        Fetch missing data points from exchange and merge with existing data.
        
        Args:
            df: Existing DataFrame from database
            symbol_pair: Trading pair symbol
            asset_info_id: Asset info ID
            start_timestamp: Start timestamp in milliseconds
            end_timestamp: End timestamp in milliseconds
            timeframe: Data timeframe
            
        Returns:
            pd.DataFrame: Combined DataFrame with all data points
        """
        if len(df) == 0:
            # No data in database, fetch entire range
            missing_ranges = [(start_timestamp, end_timestamp)]
        else:
            # Find gaps in data
            df = df.sort_values('timestamp')
            timestamps = pd.to_datetime(df['timestamp'])
            timeframe_ms = self._get_timeframe_ms(timeframe)
            
            missing_ranges = []
            
            # Check if we need data before the first timestamp
            first_ts = int(timestamps.iloc[0].timestamp() * 1000)
            if first_ts - start_timestamp > timeframe_ms:
                missing_ranges.append((start_timestamp, first_ts))
            
            # Check for gaps in the middle
            current_ts = first_ts
            for ts in timestamps[1:]:
                ts_ms = int(ts.timestamp() * 1000)
                if ts_ms - current_ts > timeframe_ms * 2:  # Allow one timeframe gap
                    missing_ranges.append((current_ts + timeframe_ms, ts_ms))
                current_ts = ts_ms
            
            # Check if we need data after the last timestamp
            last_ts = int(timestamps.iloc[-1].timestamp() * 1000)
            if end_timestamp - last_ts > timeframe_ms:
                missing_ranges.append((last_ts + timeframe_ms, end_timestamp))
        
        # Fetch missing data
        for start_ts, end_ts in missing_ranges:
            logger.info(f"Fetching missing data for {symbol_pair} from {datetime.fromtimestamp(start_ts/1000)} to {datetime.fromtimestamp(end_ts/1000)}")
            
            ohlcv_data = self._fetch_all_ohlcv(
                symbol_pair,
                timeframe,
                start_ts,
                end_ts
            )
            
            if ohlcv_data:
                # Insert into database
                self._insert_ohlcv_data(asset_info_id, timeframe, ohlcv_data)
                
                # Convert to DataFrame and merge
                new_df = pd.DataFrame(
                    ohlcv_data,
                    columns=['timestamp', 'open', 'high', 'low', 'close', 'volume']
                )
                new_df['timestamp'] = pd.to_datetime(new_df['timestamp'], unit='ms')
                
                df = pd.concat([df, new_df], ignore_index=True)
                df = df.drop_duplicates(subset=['timestamp']).sort_values('timestamp')
        
        return df

    def create_dataloader_from_df(
        self, 
        df: pd.DataFrame, 
        batch_size: int = 128, 
        seq_length: int = 1,
        shuffle: bool = False
    ) -> DataLoader:
        """
        Create a PyTorch DataLoader from a DataFrame.
        
        Args:
            df: DataFrame containing OHLCV data
            batch_size: Batch size for DataLoader
            seq_length: Length of sequences to return
            shuffle: Whether to shuffle the data
            
        Returns:
            DataLoader: PyTorch DataLoader for the data
        """
        dataset = OHLCVDataset(df, seq_length=seq_length)
        return DataLoader(
            dataset,
            batch_size=batch_size,
            shuffle=shuffle,
            num_workers=0,
            pin_memory=True
        )

    def stream_data_from_db(
        self,
        symbol: str,
        start_date: str,
        end_date: str,
        timeframe: str = '1m',
        batch_size: int = 128
    ) -> DataLoader:
        """
        Stream data from database in batches to avoid loading everything into memory.
        
        Args:
            symbol: Trading pair symbol (e.g., 'BTC/USDT')
            start_date: Start date in 'YYYY-MM-DD' format
            end_date: End date in 'YYYY-MM-DD' format
            timeframe: Data timeframe ('1m', '5m', '1h', '1d')
            batch_size: Batch size for database queries
            
        Returns:
            DataLoader: PyTorch DataLoader for streaming data
        """
        base_symbol = symbol.split('/')[0]
        asset_info_id = self._get_asset_info_id(base_symbol)
        
        if not asset_info_id:
            raise ValueError(f"No asset info found for {base_symbol}")
            
        start_timestamp = int(datetime.strptime(start_date, '%Y-%m-%d').timestamp() * 1000)
        end_timestamp = int(datetime.strptime(end_date, '%Y-%m-%d').timestamp() * 1000)
        
        # Create a custom dataset that fetches data on-demand
        class StreamingOHLCVDataset(Dataset):
            def __init__(self, data_loader, asset_info_id, timeframe, start_ts, end_ts, batch_size):
                self.data_loader = data_loader
                self.asset_info_id = asset_info_id
                self.timeframe = timeframe
                self.start_ts = start_ts
                self.end_ts = end_ts
                self.batch_size = batch_size
                
                # Get total count to determine length
                with self.data_loader.conn.cursor() as cursor:
                    cursor.execute("""
                        SELECT COUNT(*) 
                        FROM "AssetPrice"
                        WHERE "assetInfoId" = %s
                        AND interval = %s
                        AND open_time BETWEEN to_timestamp(%s) AND to_timestamp(%s)
                    """, (
                        self.asset_info_id,
                        self.timeframe,
                        self.start_ts / 1000,
                        self.end_ts / 1000
                    ))
                    self.total_count = cursor.fetchone()[0]
                
            def __len__(self):
                return self.total_count
                
            def __getitem__(self, idx):
                # Calculate offset for pagination
                offset = idx * self.batch_size
                
                # Fetch batch from database
                with self.data_loader.conn.cursor(row_factory=dict_row) as cursor:
                    cursor.execute("""
                        SELECT 
                            "open_time" as timestamp,
                            "openPrice" as open,
                            "highPrice" as high,
                            "lowPrice" as low,
                            "closePrice" as close,
                            volume
                        FROM "AssetPrice"
                        WHERE "assetInfoId" = %s
                        AND interval = %s
                        AND open_time BETWEEN to_timestamp(%s) AND to_timestamp(%s)
                        ORDER BY open_time ASC
                        LIMIT %s OFFSET %s
                    """, (
                        self.asset_info_id,
                        self.timeframe,
                        self.start_ts / 1000,
                        self.end_ts / 1000,
                        self.batch_size,
                        offset
                    ))
                    
                    rows = cursor.fetchall()
                    
                    if not rows:
                        # Return empty tensor if no data
                        return {
                            'timestamp': torch.tensor([]),
                            'features': torch.tensor([])
                        }
                    
                    # Convert to tensors
                    df = pd.DataFrame(rows)
                    df['timestamp'] = pd.to_datetime(df['timestamp'])
                    
                    features = df[['open', 'high', 'low', 'close', 'volume']].values
                    timestamps = df['timestamp'].values
                    
                    return {
                        'timestamp': timestamps,
                        'features': torch.FloatTensor(features)
                    }
        
        # Create streaming dataset and dataloader
        dataset = StreamingOHLCVDataset(
            self, asset_info_id, timeframe, start_timestamp, end_timestamp, batch_size
        )
        
        return DataLoader(
            dataset,
            batch_size=1,  # Already batched in the dataset
            shuffle=False,
            num_workers=0
        )