from openai import base_url
from sqlalchemy.testing.plugin.plugin_base import logging

from utils.connection import get_connection
from langchain_ollama import OllamaEmbeddings
import elasticsearch
from langchain_elasticsearch import ElasticsearchStore
from langchain_core.documents import Document
from langchain_text_splitters import CharacterTextSplitter
from dotenv import load_dotenv
import logging
import os

load_dotenv()


class TransactionEmbedding:
    def __init__(self) -> None:
        self.conn = get_connection()
        self.cursor = self.conn.cursor()
        self.embedding_model = OllamaEmbeddings(model="llama3.1", base_url=os.getenv('LLM_SERVER_URL'))
        es_client = elasticsearch.Elasticsearch(
            hosts=[os.getenv('VECTOR_STORE_URL')],
            max_retries=10,
        )
        self.vector_store = ElasticsearchStore(
            embedding=self.embedding_model,
            index_name="txn_amount_index",
            es_connection=es_client,
        )

    def _combine_transaction_details(self, transaction):
        combined_content = f'''
            Description:
            {transaction['description']}

            Amount:
            {transaction['amount']}
        '''
        print(combined_content)

        return combined_content

    def embed_transactions(self, transactions):
        documents = [Document(page_content=self._combine_transaction_details(transaction), metadata={"id": transaction['id']})
                     for transaction in transactions]
        text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
        docs = text_splitter.split_documents(documents)

        self.vector_store.add_documents(docs)