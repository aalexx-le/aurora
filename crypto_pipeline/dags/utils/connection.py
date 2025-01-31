import psycopg
from airflow.models.connection import Connection

def get_connection():
    conn_from_airflow = Connection.get_connection_from_secrets("xela_db")
    print(conn_from_airflow.get_uri())
    psycopg3_conn = psycopg.connect("postgresql://postgre:abcd1234@host.docker.internal:5432/xela")
    
    return psycopg3_conn