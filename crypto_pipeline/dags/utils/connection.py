import psycopg
from airflow.models.connection import Connection
import logging

logger = logging.getLogger(__name__)

def get_connection():
    conn_from_airflow = Connection.get_connection_from_secrets("xela_db")
    logger.info(f"Connect to xela_db: {conn_from_airflow.get_uri()}")
    psycopg3_conn = psycopg.connect(conn_from_airflow.get_uri())
    
    return psycopg3_conn