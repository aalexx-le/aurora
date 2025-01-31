from psycopg import sql
from typing import List

INSERT_SQL_SCRIPT = 'INSERT INTO {table} ({names}) VALUES ({fields})'


def get_insert_sql_script(table: str, fields: List[str]):
    return sql.SQL(INSERT_SQL_SCRIPT).format(
        table=sql.Identifier(table),
        names=sql.SQL(', ').join(map(sql.Identifier, fields)),
        fields=sql.SQL(', ').join(map(sql.Placeholder, fields))
    )


GET_BY_KEY_SQL_SCRIPT = 'SELECT {field} FROM {table} WHERE {pkey} = %s'


def get_query_sql_script(table: str, fields: List[str], pkey: str):
    return sql.SQL(GET_BY_KEY_SQL_SCRIPT).format(
        table=sql.Identifier(table),
        field=sql.SQL(', ').join(map(sql.Identifier, fields)),
        pkey=sql.Identifier(pkey)
    )


GET_ALL_SQL_SCRIPT = 'SELECT {field} FROM {table}'


def get_all_query_sql_script(table: str, fields: List[str]):
    return sql.SQL(GET_ALL_SQL_SCRIPT).format(
        table=sql.Identifier(table),
        field=sql.SQL(',  ').join(map(sql.Identifier, fields))
    )

