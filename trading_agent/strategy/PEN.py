"""
PEN (Prediction-Explanation Network) Deep Learning Strategy

Implementation of the PEN model based on the paper:
"PEN: Prediction-Explanation Network to Forecast Stock Price Movement with Better Explainability"

This model combines prediction accuracy with explainability for trading decisions.
"""

import io
import logging
import os
from abc import ABC
from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Tuple, Union

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.preprocessing import StandardScaler
from torch.utils.data import DataLoader, Dataset
from tqdm import tqdm

# Import the Strategy base class from our trading system
from strategy.index import Strategy

# Import MLOps utilities if available
try:
    import mlflow
    from utils.mlflow import log_model_training
    MLFLOW_AVAILABLE = True
except ImportError:
    MLFLOW_AVAILABLE = False

# Configure logging
logger = logging.getLogger("pen_strategy")

class FinancialDataset(Dataset):
    """Dataset for financial time series data."""
    
    def __init__(self, data: np.ndarray, seq_length: int, target_horizon: int = 1):
        """
        Initialize the financial dataset.
        
        Args:
            data: Numpy array of shape (n_samples, n_features)
            seq_length: Length of input sequences
            target_horizon: How many steps ahead to predict
        """
        if not isinstance(data, np.ndarray):
            raise ValueError("Data must be a numpy array")
            
        if len(data) < seq_length + target_horizon:
            raise ValueError(
                f"Data length ({len(data)}) must be greater than "
                f"sequence length + target horizon ({seq_length + target_horizon})"
            )
            
        self.data = data
        self.seq_length = seq_length
        self.target_horizon = target_horizon
        
    def __len__(self) -> int:
        """Return the number of sequences in the dataset."""
        return max(0, len(self.data) - self.seq_length - self.target_horizon + 1)
    
    def __getitem__(self, idx: int) -> Tuple[torch.FloatTensor, torch.FloatTensor]:
        """
        Get a sequence and its corresponding target.
        
        Args:
            idx: Index of the sequence
            
        Returns:
            Tuple of (input sequence, target label)
        """
        if idx < 0 or idx >= len(self):
            raise IndexError("Index out of range")
            
        # Get sequence of data as input
        x = self.data[idx:idx + self.seq_length]
        
        # Get target (price movement direction: sell=0, hold=1, buy=2)
        y_idx = idx + self.seq_length + self.target_horizon - 1
        current_close = self.data[idx + self.seq_length - 1, 3]  # Assuming close price is at index 3
        future_close = self.data[y_idx, 3]
        
        # Calculate percentage change
        pct_change = (future_close - current_close) / current_close * 100
        
        # Determine class based on percentage change
        if pct_change < -0.5:  # Sell if price drops more than 0.5%
            y_class = 0  # Sell
        elif pct_change > 0.5:  # Buy if price rises more than 0.5%
            y_class = 2  # Buy
        else:
            y_class = 1  # Hold
            
        # Convert to one-hot encoding
        y = torch.zeros(3)
        y[y_class] = 1.0
            
        return torch.FloatTensor(x), y


class AttentionModule(nn.Module):
    """Attention mechanism for PEN model."""
    
    def __init__(self, input_dim: int, attention_dim: int):
        """
        Initialize attention module.
        
        Args:
            input_dim: Dimension of input features
            attention_dim: Dimension of attention layer
        """
        super(AttentionModule, self).__init__()
        self.attention = nn.Sequential(
            nn.Linear(input_dim, attention_dim),
            nn.Tanh(),
            nn.Linear(attention_dim, 1),
            nn.Softmax(dim=1)
        )
        
    def forward(self, x):
        """
        Forward pass.
        
        Args:
            x: Input tensor of shape (batch_size, seq_length, input_dim)
            
        Returns:
            Tuple of (context_vector, attention_weights)
        """
        # Calculate attention weights
        attention_weights = self.attention(x)
        
        # Apply attention weights to input
        context_vector = torch.sum(x * attention_weights, dim=1)
        
        return context_vector, attention_weights


class PENModel(nn.Module):
    """
    Prediction-Explanation Network (PEN) model.
    
    This model follows the architecture described in the paper, with:
    1. A shared encoder (LSTM)
    2. A prediction branch for forecasting price movements
    3. An explanation branch with attention mechanism for interpretability
    """
    
    def __init__(
        self, 
        input_dim: int, 
        hidden_dim: int = 128, 
        lstm_layers: int = 2,
        dropout: float = 0.2,
        attention_dim: int = 64
    ):
        """
        Initialize PEN model.
        
        Args:
            input_dim: Number of input features
            hidden_dim: Hidden dimension for LSTM layers
            lstm_layers: Number of LSTM layers
            dropout: Dropout rate
            attention_dim: Dimension of attention mechanism
        """
        super(PENModel, self).__init__()
        
        # Shared encoder (LSTM)
        self.lstm = nn.LSTM(
            input_size=input_dim,
            hidden_size=hidden_dim,
            num_layers=lstm_layers,
            batch_first=True,
            dropout=dropout if lstm_layers > 1 else 0,
            bidirectional=True
        )
        
        # The output of bidirectional LSTM has twice the hidden_dim
        lstm_output_dim = hidden_dim * 2
        
        # Prediction branch - now outputs 3 values (sell, hold, buy)
        self.prediction_branch = nn.Sequential(
            nn.Linear(lstm_output_dim, hidden_dim),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_dim, 3),
            nn.Softmax(dim=1)  # Output probabilities for sell, hold, buy
        )
        
        # Explanation branch with attention
        self.attention = AttentionModule(lstm_output_dim, attention_dim)
        self.explanation_branch = nn.Sequential(
            nn.Linear(lstm_output_dim, hidden_dim),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(hidden_dim, 3),
            nn.Softmax(dim=1)  # Output probabilities for sell, hold, buy
        )
        
    def forward(self, x):
        """
        Forward pass.
        
        Args:
            x: Input tensor of shape (batch_size, seq_length, input_dim)
            
        Returns:
            Dict containing prediction, explanation, and attention weights
        """
        # Pass through shared encoder (LSTM)
        lstm_out, _ = self.lstm(x)
        
        # For prediction branch, use the last LSTM output
        last_output = lstm_out[:, -1, :]
        prediction = self.prediction_branch(last_output)
        
        # For explanation branch, use attention mechanism
        context_vector, attention_weights = self.attention(lstm_out)
        explanation = self.explanation_branch(context_vector)
        
        return {
            'prediction': prediction,
            'explanation': explanation,
            'attention_weights': attention_weights
        }


class PENStrategy(Strategy):
    """
    Trading strategy using the PEN (Prediction-Explanation Network) model.
    
    This strategy uses deep learning to predict price movements and provide
    explainable trading decisions.
    """
    
    def __init__(
        self, 
        symbols: List[str], 
        model_params: Dict = None,
        training_params: Dict = None,
        seq_length: int = 20,
        target_horizon: int = 1,
        update_frequency: int = 7,  # Days between model updates
        device: str = None,
        num_workers: int = 4,  # Number of workers for data loading
        batch_size: int = 64,  # Batch size for training
        enable_mlflow: bool = True  # Enable MLflow tracking
    ):
        """
        Initialize PEN strategy.
        
        Args:
            symbols: List of trading symbols
            model_params: Model architecture parameters
            training_params: Training hyperparameters
            seq_length: Length of input sequences
            target_horizon: Prediction horizon
            update_frequency: Days between model updates
            device: Computing device ('cuda', 'cuda:0', 'cpu')
            num_workers: Number of workers for DataLoader
            batch_size: Batch size for training
            enable_mlflow: Enable MLflow tracking
        """
        super().__init__(name="PEN", symbols=symbols)
        
        self.params = {
            'seq_length': seq_length,
            'target_horizon': target_horizon,
            'num_workers': num_workers,
            'batch_size': batch_size,
            'update_frequency': update_frequency  # Add update_frequency to params
        }
        
        # Default model parameters if not provided
        self.model_params = model_params or {
            'hidden_dim': 128,
            'lstm_layers': 2,
            'dropout': 0.2,
            'attention_dim': 64
        }
        
        # Default training parameters if not provided
        self.training_params = training_params or {
            'learning_rate': 0.001,
            'epochs': 50,
            'early_stopping_patience': 5
        }
        
        # Set device
        if device is None:
            self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        else:
            self.device = torch.device(device)
        
        # Track model state
        self.models = {}  # Store trained models
        self.scalers = {}  # Store fitted scalers
        self.model_trained = {symbol: False for symbol in symbols}  # Track if model is trained
        self.last_update = {symbol: None for symbol in symbols}  # Track last model update
        self.update_frequency = update_frequency  # Days between model updates (keep this for backward compatibility)
        
        # MLflow tracking
        self.enable_mlflow = enable_mlflow and MLFLOW_AVAILABLE
        self.mlflow_run_ids = {}  # Store MLflow run IDs for each symbol
        
        # Create model checkpoints directory if it doesn't exist
        os.makedirs('model_checkpoints', exist_ok=True)

    def _preprocess_data(self, df: pd.DataFrame) -> np.ndarray:
        """
        Preprocess market data for the model.
        
        Args:
            df: DataFrame with OHLCV data
            
        Returns:
            Numpy array of features
        """
        # Make a copy to avoid modifying the original
        data = df.copy()
        
        # Ensure data is sorted by timestamp
        if 'timestamp' in data.columns:
            data = data.sort_values('timestamp')
        
        # Add technical indicators as features
        # 1. Simple moving averages
        data['sma_5'] = data['close'].rolling(window=5).mean()
        data['sma_10'] = data['close'].rolling(window=10).mean()
        
        # 2. Relative price changes
        data['price_change'] = data['close'].pct_change()
        data['price_change_5'] = data['close'].pct_change(periods=5)
        
        # 3. Volatility (standard deviation of returns)
        data['volatility_5'] = data['price_change'].rolling(window=5).std()
        
        # 4. MACD
        data['ema_12'] = data['close'].ewm(span=12, adjust=False).mean()
        data['ema_26'] = data['close'].ewm(span=26, adjust=False).mean()
        data['macd'] = data['ema_12'] - data['ema_26']
        data['macd_signal'] = data['macd'].ewm(span=9, adjust=False).mean()
        
        # 5. RSI
        delta = data['close'].diff()
        gain = delta.where(delta > 0, 0)
        loss = -delta.where(delta < 0, 0)
        avg_gain = gain.rolling(window=14).mean()
        avg_loss = loss.rolling(window=14).mean()
        rs = avg_gain / avg_loss
        data['rsi'] = 100 - (100 / (1 + rs))
        
        data = data.dropna()
        
        # Select feature columns (excluding timestamp)
        self.feature_columns = [col for col in data.columns if col != 'timestamp']
        
        # Convert to numpy array
        return data[self.feature_columns].values
    
    def _create_model(self, input_dim: int) -> PENModel:
        """
        Create a new PEN model.
        
        Args:
            input_dim: Number of input features
            
        Returns:
            PEN model
        """
        model = PENModel(
            input_dim=input_dim,
            hidden_dim=self.model_params['hidden_dim'],
            lstm_layers=self.model_params['lstm_layers'],
            dropout=self.model_params['dropout'],
            attention_dim=self.model_params['attention_dim']
        )
        return model.to(self.device)
    
    def _train_model(self, symbol: str, data: pd.DataFrame) -> None:
        """
        Train PEN model for a symbol.
        
        Args:
            symbol: Trading symbol
            data: Historical price data
        """
        logger.info(f"Training PEN model for {symbol}...")
        
        # Preprocess data
        preprocessed_data = self._preprocess_data(data)
        if preprocessed_data is None:
            logger.warning(f"Insufficient data for {symbol}, skipping training")
            return
        
        # Split data into train and validation sets
        train_size = int(len(preprocessed_data) * 0.8)
        train_data = preprocessed_data[:train_size]
        val_data = preprocessed_data[train_size:]
        
        if len(train_data) < self.params['seq_length'] + self.params['target_horizon']:
            logger.warning(f"Insufficient training data for {symbol}, need at least {self.params['seq_length'] + self.params['target_horizon']} samples")
            return
        
        try:
            # Initialize scaler and transform data
            scaler = StandardScaler()
            train_data = scaler.fit_transform(train_data)
            val_data = scaler.transform(val_data)
            self.scalers[symbol] = scaler  # Store the scaler
            
            # Save the scaler for future use
            import pickle
            scaler_path = self._get_model_path(symbol).replace('_best.pth', '_scaler.pkl')
            with open(scaler_path, 'wb') as f:
                pickle.dump(scaler, f)
            
            # Create datasets
            train_dataset = FinancialDataset(
                train_data, 
                self.params['seq_length'],
                self.params['target_horizon']
            )
            
            val_dataset = FinancialDataset(
                val_data,
                self.params['seq_length'],
                self.params['target_horizon']
            )
            
            if len(train_dataset) == 0:
                logger.warning(f"No valid sequences could be generated for {symbol}")
                return
            
            # Create dataloaders
            train_dataloader = DataLoader(
                train_dataset,
                batch_size=self.params['batch_size'],
                shuffle=True,
                num_workers=self.params['num_workers'],
                pin_memory=True
            )
            
            val_dataloader = DataLoader(
                val_dataset,
                batch_size=self.params['batch_size'],
                shuffle=False,
                num_workers=self.params['num_workers'],
                pin_memory=True
            )
            
            # Initialize model
            input_dim = train_data.shape[1]
            model = PENModel(input_dim=input_dim, **self.model_params)
            model = model.to(self.device)
            
            # Initialize optimizer and loss function
            optimizer = optim.Adam(model.parameters(), lr=self.training_params['learning_rate'])
            criterion = nn.CrossEntropyLoss()
            
            # Training loop
            best_loss = float('inf')
            patience = self.training_params.get('early_stopping_patience', 5)
            patience_counter = 0
            
            # Define model path before using it
            model_path = self._get_model_path(symbol)
            
            # Initialize training history
            history = {
                'train_loss': [],
                'val_loss': [],
                'val_accuracy': []
            }
            
            progress_bar = tqdm(
                range(self.training_params['epochs']),
                desc=f"Training {symbol}",
                leave=True
            )
            
            for epoch in progress_bar:
                model.train()
                total_loss = 0
                
                for batch_x, batch_y in train_dataloader:
                    # Move data to device
                    batch_x = batch_x.to(self.device)
                    batch_y = batch_y.to(self.device)
                    
                    # Forward pass
                    outputs = model(batch_x)
                    loss = criterion(outputs['prediction'], batch_y)
                    
                    # Backward pass and optimize
                    optimizer.zero_grad()
                    loss.backward()
                    torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
                    optimizer.step()
                    
                    total_loss += loss.item()
                
                avg_train_loss = total_loss / len(train_dataloader)
                history['train_loss'].append(avg_train_loss)
                
                # Validation
                model.eval()
                val_loss = 0
                all_preds = []
                all_targets = []
                
                with torch.no_grad():
                    for batch_x, batch_y in val_dataloader:
                        batch_x = batch_x.to(self.device)
                        batch_y = batch_y.to(self.device)
                        
                        outputs = model(batch_x)
                        loss = criterion(outputs['prediction'], batch_y)
                        val_loss += loss.item()
                        
                        # Get predictions
                        preds = torch.argmax(outputs['prediction'], dim=1)
                        all_preds.extend(preds.cpu().numpy())
                        all_targets.extend(batch_y.cpu().numpy())
                
                avg_val_loss = val_loss / len(val_dataloader)
                val_accuracy = np.mean(np.array(all_preds) == np.array(all_targets))
                
                history['val_loss'].append(avg_val_loss)
                history['val_accuracy'].append(val_accuracy)
                
                progress_bar.set_postfix({
                    'train_loss': f'{avg_train_loss:.4f}',
                    'val_loss': f'{avg_val_loss:.4f}',
                    'val_acc': f'{val_accuracy:.4f}'
                })
                
                # Early stopping
                if avg_val_loss < best_loss:
                    best_loss = avg_val_loss
                    patience_counter = 0
                    torch.save(model.state_dict(), model_path)
                else:
                    patience_counter += 1
                    if patience_counter >= patience:
                        logger.info(
                            f"[{symbol}] Early stopping triggered at epoch "
                            f"{epoch+1}/{self.training_params['epochs']}"
                        )
                        break
            
            # Load best model
            model.load_state_dict(torch.load(model_path))
            model.eval()
            
            # Store model
            self.models[symbol] = model
            self.model_trained[symbol] = True
            self.last_update[symbol] = datetime.now()
            
            # Log to MLflow if enabled
            if self.enable_mlflow:
                try:
                    run_id = log_model_training(
                        model=model,
                        symbol=symbol,
                        model_params=self.model_params,
                        training_params=self.training_params,
                        history=history,
                        scaler=scaler,
                        model_path=model_path
                    )
                    self.mlflow_run_ids[symbol] = run_id
                    logger.info(f"Model training for {symbol} logged to MLflow with run ID: {run_id}")
                    
                    # Save and log scaler
                    scaler_path = model_path.replace('_best.pth', f'_scaler_{run_id}.pkl')
                    with open(scaler_path, 'wb') as f:
                        pickle.dump(scaler, f)
                    mlflow.log_artifact(scaler_path)
                except Exception as e:
                    logger.error(f"Error logging to MLflow: {e}")
            
            logger.info(f"Model training completed for {symbol}")
            
        except Exception as e:
            logger.error(f"Error training model for {symbol}: {e}")
            import traceback
            logger.error(traceback.format_exc())
    
    def _check_models_update(self, market_data: Dict):
        """
        Check if models need to be updated and update them if necessary.
        
        Args:
            market_data: Dictionary of market data by symbol
        """
        for symbol in self.symbols:
            # Convert symbol key to match market_data keys (contains exchange suffix)
            symbol_keys = [key for key in market_data.keys() if key.startswith(symbol)]
            
            if not symbol_keys:
                continue
                
            # Use the first available exchange data for training
            symbol_key = symbol_keys[0]
            data = market_data[symbol_key]
            
            # Check if we need to update the model
            current_time = datetime.now()
            needs_update = (
                symbol not in self.last_update or
                (current_time - self.last_update[symbol]).days >= self.params['update_frequency']
            )
            
            if needs_update and isinstance(data, pd.DataFrame) and not data.empty:
                logger.info(f"Updating model for {symbol}")
                
                # Train model
                self._train_model(symbol, data)
    
    def _generate_prediction(self, symbol: str, data: np.ndarray) -> Tuple[str, Optional[np.ndarray]]:
        """
        Generate prediction for a symbol using the trained model.
        
        Args:
            symbol: Trading symbol
            data: Preprocessed data
            
        Returns:
            Tuple of (signal, attention_weights)
        """
        # Check if we have a trained model
        if symbol not in self.models or not self.model_trained[symbol]:
            logger.warning(f"No trained model available for {symbol}, defaulting to 'hold'")
            return 'hold', None
        
        # Check if data is empty
        if data is None or len(data) == 0 or data.shape[0] == 0:
            logger.debug(f"Empty data for {symbol}, defaulting to 'hold'")
            return 'hold', None
            
        if symbol in self.scalers:
            # Scale the data
            data_scaled = self.scalers[symbol].transform(data)
        else:
            logger.warning(f"No scaler available for {symbol}")
            return 'hold', None
        
        # Prepare input sequence
        seq_length = self.params['seq_length']
        if len(data_scaled) < seq_length:
            logger.debug(f"Not enough data for prediction for {symbol}")
            return 'hold', None
        
        # Get the last seq_length data points
        input_seq = data_scaled[-seq_length:]
        input_tensor = torch.FloatTensor(input_seq).unsqueeze(0).to(self.device)
        
        # Make prediction
        model = self.models[symbol].to(self.device)
        model.eval()
        with torch.no_grad():
            outputs = model(input_tensor)
            prediction_probs = outputs['prediction'].cpu().numpy()[0]
            attention_weights = outputs['attention_weights'].cpu().numpy()
        
        # Get the class with highest probability
        signal_idx = np.argmax(prediction_probs)
        signal_map = {0: 'sell', 1: 'hold', 2: 'buy'}
        signal = signal_map[signal_idx]
        
        return signal, attention_weights
    
    def _plot_attention(self, symbol: str, data: pd.DataFrame, attention_weights: np.ndarray) -> bytes:
        """
        Create a plot showing attention weights for explainability.
        
        Args:
            symbol: Trading symbol
            data: Original market data
            attention_weights: Attention weights from the model
            
        Returns:
            Image bytes
        """
        # Create a figure
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8), gridspec_kw={'height_ratios': [3, 1]})
        
        # Plot price data
        seq_length = self.params['seq_length']
        timestamps = data['timestamp'].iloc[-seq_length:].values
        close_prices = data['close'].iloc[-seq_length:].values
        
        ax1.plot(timestamps, close_prices, label='Close Price')
        ax1.set_title(f"{symbol} Price and Attention Weights")
        ax1.set_xlabel('Time')
        ax1.set_ylabel('Price')
        ax1.legend()
        ax1.grid(True)
        
        # Plot attention weights
        if attention_weights is not None:
            ax2.bar(timestamps, attention_weights.squeeze(), alpha=0.7)
            ax2.set_xlabel('Time')
            ax2.set_ylabel('Attention Weight')
            ax2.grid(True)
        
        plt.tight_layout()
        
        # Save to bytes
        buf = io.BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        plt.close()
        
        return buf.getvalue()
    
    def generate_signals(self, market_data: Dict) -> Dict[str, str]:
        """
        Generate trading signals using the PEN model.
        
        Args:
            market_data: Dictionary of market data by symbol
            
        Returns:
            Dictionary of trading signals by symbol
        """
        # First, try to load any pretrained models if we haven't already
        if not any(self.model_trained.values()):
            self._load_pretrained_models()
        
        # Check if models need to be updated
        self._check_models_update(market_data)
        
        signals = {}
        explanations = {}
        
        for symbol in self.symbols:
            # Convert symbol key to match market_data keys (contains exchange suffix)
            symbol_keys = [key for key in market_data.keys() if key.startswith(symbol)]
            
            if not symbol_keys:
                logger.warning(f"No market data available for {symbol}")
                for exchange_id in self.exchanges:
                    signals[symbol] = 'hold'
                continue
            
            # Generate predictions for each exchange
            for symbol_key in symbol_keys:
                data = market_data[symbol_key]
                
                if not isinstance(data, pd.DataFrame) or data.empty:
                    logger.warning(f"Empty or invalid data for {symbol_key}, defaulting to 'hold'")
                    signals[symbol_key] = 'hold'
                    continue
                # Preprocess data
                preprocessed_data = self._preprocess_data(data)
                
                if preprocessed_data is None:
                    logger.warning(f"Insufficient data for {symbol_key}, defaulting to 'hold'")
                    signals[symbol_key] = 'hold'
                    continue
                
                # Generate prediction
                signal, attention_weights = self._generate_prediction(symbol, preprocessed_data)
                signals[symbol_key] = signal
                
                # Generate explanation plot if we have attention weights
                if attention_weights is not None:
                    explanation_plot = self._plot_attention(symbol, data, attention_weights)
                    explanations[symbol_key] = {
                        'signal': signal,
                        'attention_plot': explanation_plot
                    }
        
        return signals

    def _get_model_path(self, symbol: str) -> str:
        """
        Get the model checkpoint file path for a symbol.
        
        Args:
            symbol: Trading symbol (e.g., 'BTC/USDT')
            
        Returns:
            Path to model checkpoint file
        """
        # Convert symbol format (e.g., 'BTC/USDT' -> 'BTC_USDT')
        formatted_symbol = symbol.replace('/', '_')
        return os.path.join('model_checkpoints', f'{formatted_symbol}_best.pth')

    def _load_pretrained_models(self) -> None:
        """
        Load pretrained models from disk if they exist.
        
        This method checks for existing model checkpoints and loads them
        to avoid unnecessary retraining.
        """
        logger.info("Checking for pretrained models...")
        
        for symbol in self.symbols:
            model_path = self._get_model_path(symbol)
            
            if os.path.exists(model_path):
                try:
                    # First, we need to create the model structure
                    # For this, we need to know the input dimension
                    # We'll try to load the scaler first to get this information
                    scaler_path = model_path.replace('_best.pth', '_scaler.pkl')
                    
                    if os.path.exists(scaler_path):
                        import pickle
                        with open(scaler_path, 'rb') as f:
                            scaler = pickle.load(f)
                            self.scalers[symbol] = scaler
                            
                        # Now we can determine the input dimension
                        input_dim = len(scaler.mean_)
                        
                        # Create the model with the correct input dimension
                        model = self._create_model(input_dim)
                        
                        # Load the weights
                        model.load_state_dict(torch.load(model_path, map_location=self.device))
                        model.eval()  # Set to evaluation mode
                        
                        self.models[symbol] = model
                        self.model_trained[symbol] = True
                        self.last_update[symbol] = datetime.now()
                        
                        logger.info(f"Successfully loaded pretrained model for {symbol}")
                    else:
                        logger.warning(f"Found model checkpoint for {symbol} but no scaler. Cannot load model.")
                except Exception as e:
                    logger.error(f"Error loading pretrained model for {symbol}: {e}") 