import psycopg
from dotenv import load_dotenv
import os
import logging
import coloredlogs
from urllib.parse import urlparse

load_dotenv()


def get_connection():
    database_url = os.getenv('DATABASE_URL')
    logging.info("Connecting to " + database_url)

    dbc = urlparse(database_url)

    conn = psycopg.connect(
        f"dbname={dbc.path[1:]} user={dbc.username} password={dbc.password} host={dbc.hostname} port={dbc.port}")

    return conn