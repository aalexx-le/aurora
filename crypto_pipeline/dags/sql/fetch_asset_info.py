from sql.base import get_insert_sql_script

INSERT_ASSET_PROFILE = get_insert_sql_script('AssetInfo', ['id', 'name', 'symbol', 'category', 'desc', 'logo'])