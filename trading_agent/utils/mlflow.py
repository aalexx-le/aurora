"""
MLflow utilities for model tracking and management.

This module provides functions for MLflow integration with the existing
PEN model training and backtesting system.
"""

import os
import pickle
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional, Tuple

import mlflow
import numpy as np
import pandas as pd
import torch
import yaml
from dotenv import load_dotenv
from sklearn.preprocessing import StandardScaler

from utils.logger import setup_logger

# Load environment variables
load_dotenv()

# Configure logging
logger = setup_logger(__name__)


def setup_mlflow() -> None:
    """
    Set up MLflow tracking based on environment variables.
    """
    tracking_uri = os.environ.get("MLFLOW_TRACKING_URI", "http://localhost:5000")
    experiment_name = os.environ.get("MLFLOW_EXPERIMENT_NAME", "PEN_Model_Training")
    
    # Set tracking URI
    mlflow.set_tracking_uri(tracking_uri)
    
    # Set experiment
    mlflow.set_experiment(experiment_name)
    
    logger.info(f"MLflow tracking URI: {mlflow.get_tracking_uri()}")
    logger.info(f"MLflow experiment: {experiment_name}")


def log_model_training(
    model: torch.nn.Module,
    symbol: str,
    model_params: Dict[str, Any],
    training_params: Dict[str, Any],
    history: Dict[str, list],
    scaler: StandardScaler,
    model_path: str
) -> str:
    """
    Log model training details to MLflow.
    
    Args:
        model: Trained PyTorch model
        symbol: Trading symbol
        model_params: Model architecture parameters
        training_params: Training hyperparameters
        history: Training history (losses, metrics)
        scaler: Fitted StandardScaler
        model_path: Path where model was saved
        
    Returns:
        MLflow run ID
    """
    with mlflow.start_run() as run:
        run_id = run.info.run_id
        logger.info(f"Logging model training to MLflow with run ID: {run_id}")
        
        # Log parameters
        mlflow.log_params({
            **model_params,
            **{f"training_{k}": v for k, v in training_params.items()},
            "symbol": symbol,
            "timestamp": datetime.now().isoformat()
        })
        
        # Log git commit if available
        try:
            import git
            repo = git.Repo(search_parent_directories=True)
            mlflow.log_param("git_commit", repo.head.object.hexsha)
        except (ImportError, git.InvalidGitRepositoryError):
            pass
        
        # Log model architecture
        mlflow.log_text(str(model), "model_architecture.txt")
        
        # Log metrics from training history
        if history:
            for metric_name, values in history.items():
                if values:
                    # Log the best value
                    if metric_name == 'val_loss':
                        mlflow.log_metric(f"best_{metric_name}", min(values))
                    elif metric_name == 'val_accuracy':
                        mlflow.log_metric(f"best_{metric_name}", max(values))
                    
                    # Log the final value
                    mlflow.log_metric(f"final_{metric_name}", values[-1])
            
            # Create and log history dataframe
            history_df = pd.DataFrame(history)
            history_path = f"model_checkpoints/{run_id}/history.csv"
            os.makedirs(os.path.dirname(history_path), exist_ok=True)
            history_df.to_csv(history_path, index=False)
            mlflow.log_artifact(history_path)
            
            # Create and log learning curves
            import matplotlib.pyplot as plt
            
            plt.figure(figsize=(12, 5))
            plt.subplot(1, 2, 1)
            plt.plot(history["train_loss"], label="Train")
            plt.plot(history["val_loss"], label="Validation")
            plt.xlabel("Epoch")
            plt.ylabel("Loss")
            plt.legend()
            plt.title("Loss Curves")
            
            plt.subplot(1, 2, 2)
            plt.plot(history["val_accuracy"], label="Validation")
            plt.xlabel("Epoch")
            plt.ylabel("Accuracy")
            plt.legend()
            plt.title("Accuracy Curve")
            
            plt.tight_layout()
            learning_curves_path = f"model_checkpoints/{run_id}/learning_curves.png"
            plt.savefig(learning_curves_path)
            mlflow.log_artifact(learning_curves_path)
            plt.close()
        
        # Save and log scaler
        scaler_path = model_path.replace('_best.pth', f'_scaler_{run_id}.pkl')
        with open(scaler_path, 'wb') as f:
            pickle.dump(scaler, f)
        mlflow.log_artifact(scaler_path)
        
        # Log the model
        mlflow.pytorch.log_model(
            model,
            "pen_model",
            registered_model_name=f"PEN_{symbol.replace('/', '_')}"
        )
        
        # Log the original model file
        if os.path.exists(model_path):
            mlflow.log_artifact(model_path)
        
        return run_id


def log_backtest_results(
    run_id: str,
    symbol: str,
    backtest_results: Dict[str, Any],
    start_date: str,
    end_date: str
) -> None:
    """
    Log backtest results to an existing MLflow run.
    
    Args:
        run_id: MLflow run ID
        symbol: Trading symbol
        backtest_results: Dictionary of backtest results
        start_date: Backtest start date
        end_date: Backtest end date
    """
    with mlflow.start_run(run_id=run_id):
        # Log backtest parameters
        mlflow.log_params({
            "backtest_start_date": start_date,
            "backtest_end_date": end_date,
            "backtest_symbol": symbol
        })
        
        # Log backtest metrics
        mlflow.log_metrics({
            "backtest_total_return": backtest_results["total_return"],
            "backtest_sharpe_ratio": backtest_results["sharpe_ratio"],
            "backtest_max_drawdown": backtest_results["max_drawdown"],
            "backtest_win_rate": backtest_results["win_rate"],
            "backtest_total_trades": backtest_results["total_trades"]
        })
        
        # Save and log equity curve
        if "equity_curve" in backtest_results:
            equity_curve_path = f"model_checkpoints/{run_id}/equity_curve.csv"
            os.makedirs(os.path.dirname(equity_curve_path), exist_ok=True)
            backtest_results["equity_curve"].to_csv(equity_curve_path)
            mlflow.log_artifact(equity_curve_path)
            
            # Plot equity curve
            import matplotlib.pyplot as plt
            plt.figure(figsize=(12, 6))
            backtest_results["equity_curve"]["equity"].plot()
            plt.title(f"Equity Curve - {symbol}")
            plt.xlabel("Date")
            plt.ylabel("Portfolio Value")
            plt.grid(True)
            equity_plot_path = f"model_checkpoints/{run_id}/equity_curve.png"
            plt.savefig(equity_plot_path)
            mlflow.log_artifact(equity_plot_path)
            plt.close() 