import json
import logging
from datetime import datetime, timedelta
from typing import Any, Dict, List, Tuple, Optional
from uuid import uuid4

from airflow import DAG
from airflow.decorators import task, task_group
from airflow.operators.trigger_dagrun import TriggerDagRunOperator
from airflow.providers.apache.kafka.operators.produce import ProduceToTopicOperator
from graphql_client.enums import CEXExchanges
from sql.base import (get_insert_sql_script, get_query_sql_script,
                      get_update_sql_script)
from dags.utils.exchange_strategies import ExchangeContext
from utils.connection import get_connection
from utils.data_model import AccountBalances, CEXAccount
from utils.status_enums import CreateExecutionStatus
from airflow.exceptions import AirflowException, AirflowSkipException
from sensors.kafka_sensor import AwaitMessageSensor
# from airflow.providers.apache.kafka.sensors.kafka import (
#     AwaitMessageTriggerFunctionSensor, AwaitMessageSensor
# )

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

def process_kafka_message(message, **context):
    """Process a message from Kafka and create a crypto portfolio."""
    logger.info(f"Received message: {message}")
    logger.info(f"Context keys: {list(context.keys())}")
    
    # Check specifically for ti in context and log its type
    if 'ti' in context:
        logger.info(f"ti exists in context, type: {type(context['ti'])}")
    else:
        logger.warning("ti does not exist in context!")
    
    try:
        # Parse the message
        payload = json.loads(message.value)
        logger.info(f"Processing message: {payload}")
        
        # Create the portfolio
        success, portfolio_id = create_portfolio(payload)
        
        # Prepare status message and store it in XCom for the producer operator
        status_message = {
            "userId": payload["userId"],
            "executionId": payload["executionId"],
            "success": success,
            "portfolioId": str(portfolio_id) if portfolio_id else None,
        }
        
        # Safely push to XCom
        if 'ti' in context:
            context["ti"].xcom_push(key="status_message", value=status_message)
            logger.info("Successfully pushed status_message to XCom")
        else:
            logger.warning("Cannot push to XCom: ti not available in context")
        
        return True
    except Exception as e:
        logger.error(f"Error processing message: {e}")
        logger.error(f"Context: {context}")
        # Prepare failure status message and store it in XCom
        try:
            status_message = {
                "userId": payload["userId"] if "payload" in locals() else None,
                "executionId": payload["executionId"] if "payload" in locals() else None,
                "success": False,
                "error": str(e)
            }
            
            if 'ti' in context:
                context["ti"].xcom_push(key="status_message", value=status_message)
                logger.info("Successfully pushed failure status to XCom")
            else:
                logger.warning("Cannot push failure status to XCom: ti not available in context")
                
        except Exception as ke:
            logger.error(f"Error preparing failure status: {ke}")
        return False

def create_portfolio(payload: Dict[str, Any]) -> Tuple[bool, Optional[uuid4]]:
    """Create a crypto portfolio from the provided payload."""
    conn = get_connection()
    cursor = conn.cursor()
    exchange_context = ExchangeContext()
    portfolio_id = None
    
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
            return False, None
        
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
        cursor.execute(UPDATE_EXECUTION_STATUS, (CreateExecutionStatus.SUCCESS.value, execution_id))
        conn.commit()
        
        logger.info(f"Successfully created portfolio with ID: {portfolio_id}")
        return True, portfolio_id
    except Exception as e:
        logger.error(f"Error creating portfolio: {e}")
        cursor.execute(UPDATE_EXECUTION_STATUS, (CreateExecutionStatus.FAILED.value, execution_id))
        conn.commit()
        return False, None
    finally:
        cursor.close()
        conn.close()

def create_status_message(**context):
    """Create the status message for Kafka producer."""
    logger.info("Creating status message for Kafka producer")
    logger.info(f"Context keys in create_status_message: {list(context.keys())}")
    
    # Check if ti is in context
    if 'ti' not in context:
        logger.warning("ti not in context for create_status_message!")
        # Return a fallback message
        return None, json.dumps({"status": "unknown"}).encode('utf-8')
    
    try:
        status_message = context["ti"].xcom_pull(task_ids='consume_crypto_portfolio', key='status_message')
        logger.info(f"Retrieved status message from XCom: {status_message}")
        
        if not status_message:
            logger.warning("No status message found in XCom")
            status_message = {"status": "unknown"}
            
        return None, json.dumps(status_message).encode('utf-8')
    except Exception as e:
        logger.error(f"Error in create_status_message: {e}", exc_info=True)
        return None, json.dumps({"status": "error", "message": str(e)}).encode('utf-8')

# Create DAG
with DAG(
    'consume_crypto_portfolio',
    default_args=default_args,
    description='Consume messages from Kafka to create crypto portfolios',
    schedule="@continuous",
    max_active_runs=1,
    catchup=False,
    render_template_as_native_obj=True,
) as dag:
    
    @task_group(group_id='kafka_consumer_group')
    def consume_messages():
        # Define the Kafka sensor task
        kafka_sensor = AwaitMessageSensor(
            task_id='consume_crypto_portfolio',
            kafka_config_id='kafka_default',
            topics=['create-crypto-portfolio'],
            apply_function='consume_crypto_portfolio.process_kafka_message',
            poll_timeout=30,
            store_xcoms=True,  # Enable storing XComs from the trigger
        )
        
        # Define the Kafka producer task
        produce_status = ProduceToTopicOperator(
            task_id='produce_status_message',
            kafka_config_id='kafka_default',
            topic='create-crypto-portfolio-status',
            producer_function="consume_crypto_portfolio.create_status_message",
        )
        
        # Add a trigger task to restart the DAG
        trigger_next_run = TriggerDagRunOperator(
            task_id='trigger_next_run',
            trigger_dag_id='consume_crypto_portfolio',
            wait_for_completion=False,
            reset_dag_run=True,
            poke_interval=30,
        )
        
        # Set task dependencies
        kafka_sensor >> produce_status >> trigger_next_run
        
    # Execute the task group
    consume_messages()