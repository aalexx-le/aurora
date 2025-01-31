# from typing import List
#
# from langchain_community.document_loaders import TextLoader
# from langchain_community.vectorstores.pgvecto_rs import PGVecto_rs
# from langchain_core.documents import Document
# from langchain_ollama import OllamaEmbeddings
# from langchain_text_splitters import CharacterTextSplitter
# from dotenv import load_dotenv
# import os
# import logging
# import coloredlogs
# import elasticsearch
# from langchain_elasticsearch import ElasticsearchStore
#
# from transaction_embedding import TransactionEmbedding
#
# coloredlogs.install()
# logging.basicConfig(level=logging.INFO)
#
# # database_url = os.getenv('VECTOR_STORE_DB_URL')
# # logging.info("Connecting to " + database_url)
#
#
#
#
# def combine_expense_details(expense):
#     combined_content = f'''
#         Category:
#         {expense['category']}
#
#         Name:
#         {expense['name']}
#
#         Description:
#         {expense['description']}
#
#         Amount:
#         {expense['amount']}
#     '''
#
#     return combined_content
#
# documents = [Document(page_content=combine_transaction_details(transaction), metadata={"id": transaction['id']}) for transaction in transactions]
# print(documents)
# # documents = [Document(page_content=expense[3], metadata={"id": expense[0]}) for expense in expenses]
# # print(documents)
# #
# # loader = TextLoader("./fake_doc.txt")
# # documents = loader.load()
#
# text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
# docs = text_splitter.split_documents(documents)
#
# embedding_model = OllamaEmbeddings(
#     model="llama3.1"
# )
#
# # db = PGVecto_rs.from_documents(
# #     documents=docs,
# #     embedding=embeddings,
# #     db_url=database_url,
# #     # The table name is f"collection_{collection_name}", so that it should be unique.
# #     collection_name="state_of_the_union",
# # )
#
# es_client = elasticsearch.Elasticsearch(
#     hosts=["http://localhost:9200"],
#     max_retries=10,
# )
#
# # elastic_vector_search = ElasticsearchStore(
# #     es_url="http://localhost:9200",
# #     index_name="langchain_index",
# #     embedding=embeddings,
# #     es_user="elastic",
# #     es_password="changeme",
# # )
#
# # vector_search = ElasticsearchStore(
# #     index_name="txn_index",
# #     es_connection=es_client,
# #     embedding=embedding_model,
# # )
#
# vector_search = ElasticsearchStore(
#     embedding=embedding_model,
#     index_name="txn_amount_index",
#     es_connection=es_client,
# )
#
# retriever = vector_search.as_retriever()
#
# retriever.
#
# # result = vector_search.similarity_search(query="LE NGUYEN NGUYEN ANH chuyen tien (0796576287)", k=10)
# #
# # print(result)
# #
# # for item in result:
# #     print(item.page_content)


import asyncio
import json
import logging
import os
from contextlib import asynccontextmanager
from datetime import datetime

import coloredlogs
import uvicorn
from aiokafka import AIOKafkaConsumer, AIOKafkaProducer
from dotenv import load_dotenv
from fastapi import FastAPI

from transaction_embedding import TransactionEmbedding

load_dotenv()

coloredlogs.install()
logging.basicConfig(level=logging.INFO)


async def transaction_embedding_consumer():
    CONSUMER_GROUP = "transaction-embedding-consumer"
    BROKER_SERVER = os.getenv('MESSAGE_BROKER_URL')
    TOPIC_NAME = "transaction-embedding"
    consumer = AIOKafkaConsumer(
        TOPIC_NAME,
        # client_id="python-client",
        group_id=CONSUMER_GROUP,
        bootstrap_servers=[BROKER_SERVER],
        # api_version=(0,11,5),
        value_deserializer=lambda v: json.loads(v),
        key_deserializer=lambda v: json.loads(v) if v is not None else v,
        # max_poll_records=10,
        auto_offset_reset="latest",
        enable_auto_commit=True,
        # session_timeout_ms=6000,
        # heartbeat_interval_ms=3000,
    )

    # producer = AIOKafkaProducer(
    #     bootstrap_servers=[BROKER_SERVER],
    # )

    embedder = TransactionEmbedding()

    await consumer.start()
    try:
        async for message in consumer:
            try:
                logging.info(f"Processing: {message.value}")

                embedder.embed_transactions([message.value])

                logging.info("Processed message")
            except Exception as e:
                logging.error(e)
                logging.error("Failed to process message")
            finally:
                await consumer.commit()
    finally:
        await consumer.stop()


@asynccontextmanager
async def startup_event(app: FastAPI):
    asyncio.create_task(transaction_embedding_consumer())
    yield

app = FastAPI(lifespan=startup_event)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5999, log_level="info")

