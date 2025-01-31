from airflow.models import Variable
from requests import Session

COINMARKETCAP_URL = 'https://pro-api.coinmarketcap.com'
COINMARKETCAP_SYMBOL_PER_REQUEST = 100

def get_cmk_session():
    API_KEY = Variable.get("CMK_API_KEY", default_var=None)
    coinmarketcap_headers = {
        'Accepts': 'application/json',
        'X-CMC_PRO_API_KEY': API_KEY,
    }
    cmk_session = Session()
    cmk_session.headers.update(coinmarketcap_headers)
    return cmk_session