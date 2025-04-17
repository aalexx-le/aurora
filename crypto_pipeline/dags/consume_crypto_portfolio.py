import json
import logging
from datetime import datetime, timedelta
from typing import Any, Dict
from uuid import uuid4

from airflow import DAG
from airflow.decorators import task
from airflow.models import Variable
from airflow.providers.apache.kafka.operators.consume import \
    ConsumeFromTopicOperator
from airflow.providers.apache.kafka.sensors.kafka import AwaitMessageSensor
from graphql_client.enums import CEXExchanges
from sql.base import (get_insert_sql_script, get_query_sql_script,
                      get_update_sql_script)
from tasks.exchange_strategies import ExchangeContext
from utils.connection import get_connection
from utils.data_model import AccountBalances, CEXAccount
from utils.status_enums import CreateExecutionStatus

# SQL queries
INSERT_CRYPTO_PORTFOLIO = get_insert_sql_script(
    "CryptoPortfolio",
    ['id', 'name', 'userId', 'tradingType', 'apiKey', 'secretKey', 'updateTime', 'exchanges']
)

INSERT_OKX_CRYPTO_PORTFOLIO = get_insert_sql_script(
    "OKXCryptoPortfolio",
    ['id', 'cryptoPortfolioId', 'passphrase']
)

INSERT_ASSET_BALANCE = get_insert_sql_script(
    "AssetBalance",
    ['id', 'cryptoPortfolioId', 'assetInfoId', 'balance', 'locked']
)

GET_ASSET_ID = get_query_sql_script(
    'AssetInfo',
    ['id'],
    'symbol'
)

UPDATE_EXECUTION_STATUS = get_update_sql_script("CreatePortfolioExecution", ["status"], "id = %s")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Default DAG arguments
default_args = {
    'owner': 'airflow',
    'start_date': datetime(2024, 3, 1),
    'retries': 1,
    'retry_delay': timedelta(minutes=1),
}

# Define the processing function to handle consumed messages
def process_message(message):
    """Process a message from Kafka and create a crypto portfolio."""
    try:
        # Parse the message
        payload = json.loads(message.value.decode('utf-8'))
        logger.info(f"Processing message: {payload}")
        
        # Create the portfolio
        create_portfolio(payload)
        
        return True
    except Exception as e:
        logger.error(f"Error processing message: {e}")
        return False

@task
def create_portfolio(payload: Dict[str, Any]):
    """Create a crypto portfolio from the provided payload."""
    conn = get_connection()
    cursor = conn.cursor()
    exchange_context = ExchangeContext()
    
    try:
        api_key = payload['apiKey']
        secret_key = payload['secretKey']
        user_id = payload['userId']
        portfolio_name = payload['name']
        execution_id = payload['executionId']
        exchanges = payload['exchanges']
        
        # Update execution status to PROCESSING
        cursor.execute(UPDATE_EXECUTION_STATUS, (CreateExecutionStatus.PROCESSING.value, execution_id))
        conn.commit()
        
        try:
            # Fetch account details from exchange
            account = exchange_context.fetch_account(
                exchange=exchanges,
                api_key=api_key,
                secret_key=secret_key,
                passphrase=payload.get('passphrase') if exchanges == CEXExchanges.OKX else None
            )
        except Exception as e:
            logger.error(f"Failed to fetch account info: {e}")
            cursor.execute(UPDATE_EXECUTION_STATUS, (CreateExecutionStatus.FAILED.value, execution_id))
            conn.commit()
            return
        
        # Create portfolio record
        portfolio_id = uuid4()
        data = {
            'id': portfolio_id,
            'name': portfolio_name,
            'userId': user_id,
            'tradingType': 'SPOT',
            'apiKey': api_key,
            'secretKey': secret_key,
            'exchanges': exchanges,
            'updateTime': account.updateTime
        }
        cursor.execute(INSERT_CRYPTO_PORTFOLIO, data)
        
        # For OKX, store passphrase
        if exchanges == CEXExchanges.OKX:
            passphrase = payload['passphrase']
            data = {
                'id': uuid4(),
                'cryptoPortfolioId': portfolio_id,
                'passphrase': passphrase
            }
            cursor.execute(INSERT_OKX_CRYPTO_PORTFOLIO, data)
        
        # Store asset balances
        for owning_coin in account.balances:
            symbol = owning_coin.asset
            
            try:
                cursor.execute(GET_ASSET_ID, (symbol,))
                results = cursor.fetchone()
                
                if results is None:
                    continue

                asset_id = results[0]
                data = {
                    'id': uuid4(),
                    'cryptoPortfolioId': portfolio_id,
                    'assetInfoId': asset_id,
                    'balance': owning_coin.free,
                    'locked': owning_coin.locked,
                }
                cursor.execute(INSERT_ASSET_BALANCE, data)
            except Exception as e:
                logger.error(f"Error storing asset balance for {symbol}: {e}")
        
        # Commit all changes and update status to SUCCESS
        conn.commit()
        cursor.execute(UPDATE_EXECUTION_STATUS, (CreateExecutionStatus.SUCCESS.value, execution_id))
        conn.commit()
        
        logger.info(f"Successfully created portfolio with ID: {portfolio_id}")
    except Exception as e:
        logger.error(f"Error creating portfolio: {e}")
        cursor.execute(UPDATE_EXECUTION_STATUS, (CreateExecutionStatus.FAILED.value, execution_id))
        conn.commit()
    finally:
        cursor.close()
        conn.close()

# Create DAG
with DAG(
    'consume_crypto_portfolio',
    default_args=default_args,
    description='Consume messages from Kafka to create crypto portfolios',
    schedule_interval=None,  # This DAG will be triggered by the Kafka sensor
    catchup=False,
) as dag:
    
    # # Define the Kafka sensor to trigger the DAG when new messages are available
    kafka_sensor = AwaitMessageSensor(
        task_id='wait_for_kafka_message',
        topics=['create-crypto-portfolio'],
        kafka_config_id='kafka_default',  # Connection ID in Airflow connections
        apply_function='consume_crypto_portfolio.process_message',  # Use string reference to the function
        xcom_push_key='retrieved_message'  # Store the message in XCom for reference
    )
    
    # Define the Kafka consumer
    consume_task = ConsumeFromTopicOperator(
        task_id='consume_from_kafka',
        topics=['create-crypto-portfolio'],
        apply_function='consume_crypto_portfolio.process_message',
        # commit_cadence='end_of_batch',
        # max_messages=10,
        # max_batch_size=10,
        poll_timeout=1.0,
    )
    
    # # Set up the task dependencies
    # kafka_sensor >> consume_task 