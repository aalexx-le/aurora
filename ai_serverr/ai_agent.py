from typing import List

from langchain_ollama import OllamaEmbeddings
import os
from psycopg.rows import dict_row
import elasticsearch
from langchain_elasticsearch import ElasticsearchStore
from connection import get_connection
from dotenv import load_dotenv

load_dotenv()

# class SuggestedExpense(BaseModel):
#     description: str = Field(description="Suggested expense description")

class AIAgent(object):
    def __init__(self):
        self.conn = get_connection()
        self.cur = self.conn.cursor(row_factory=dict_row)

        self.embedding_model = OllamaEmbeddings(
            model="llama3.1",
            base_url=os.getenv("LLM_SERVER_URL")
        )

        es_client = elasticsearch.Elasticsearch(
            hosts=[os.getenv("VECTOR_STORE_URL")],
            max_retries=10,
        )

        self.vector_store = ElasticsearchStore(
            index_name="txn_amount_index",
            es_connection=es_client,
            embedding=self.embedding_model,
        )

    def _combine_transaction_details(self, transaction):
        combined_content = f'''
            Description:
            {transaction['description']}

            Amount:
            {transaction['amount']}
        '''

        return combined_content

    def get_transaction(self):
        GET_TRANSACTIONS = '''
            SELECT * FROM "BankTransaction"
        '''

        self.cur.execute(GET_TRANSACTIONS)

        txns = self.cur.fetchall()

        return txns

    def get_transaction_by_id(self, txn_id):
        GET_TRANSACTION_BY_ID = '''
            SELECT * FROM "BankTransaction" WHERE "id" = %s
        '''

        self.cur.execute(GET_TRANSACTION_BY_ID, (txn_id,))

        txn = self.cur.fetchone()

        return txn

    def get_expense_by_txn_id(self, transaction_id):
        GET_EXPENSE_BY_TXN_ID = '''
            SELECT e.*, ec."name" as "categoryName" 
            FROM "Expense" e
            JOIN "ExpenseCategory" ec ON e."categoryId" = ec."id"
            WHERE "bankTransactionId" = %s
        '''

        self.cur.execute(GET_EXPENSE_BY_TXN_ID, (transaction_id,))

        expense = self.cur.fetchone()

        return expense

    def get_expense_by_similar_txn_amount(self, amount):
        GET_EXPENSE_BY_SIMILAR_TXN_AMOUNT = '''
            SELECT ex.*
            FROM "BankTransaction" e
            JOIN "Expense" ex ON ex."bankTransactionId" = e.id
            ORDER BY abs(abs(e.amount) - abs(%s)) ASC 
            LIMIT 2
        '''

        self.cur.execute(GET_EXPENSE_BY_SIMILAR_TXN_AMOUNT, (amount,))

        expenses = self.cur.fetchall()

        return expenses

    def get_suggestion(self, bank_transaction_id: str) -> List[dict]:
        transaction = self.get_transaction_by_id(bank_transaction_id)

        query = self._combine_transaction_details(transaction)

        similar_transaction = self.vector_store.similarity_search_with_score(
            query=query,
            k=10
        )

        suggestions = []
        # llm = ChatOllama(model="llama3.1", format="json")
        # structured_llm = llm.with_structured_output(SuggestedExpense)
        #
        # prompt_template = """
        #     You are an expense suggestion agent.
        #
        #     Given a bank transaction description, an expense name, expense category name, and expense amount, suggest the expense description.
        #
        #     Bank Transaction:
        #     {bank_transaction}
        #
        #     Suggested Expense Name:
        #     {expense_name}
        #
        #     Suggested Expense Category:
        #     {expense_category}
        #
        #     Suggested Expense Amount:
        #     {expense_amount}
        #
        #     Provide your response as a JSON object with the following keys: description.
        #
        #     Example:
        #     ```json
        #     {{
        #       "description": "Morning coffee"
        #     }}
        #     ```
        # """
        #
        # PROMPT = PromptTemplate(
        #     template=prompt_template,
        #     input_variables=["bank_transaction", "expense_name", "expense_category", "expense_amount"]
        # )
        #
        # parser = PydanticOutputParser(pydantic_object=SuggestedExpense)

        for txn, score in similar_transaction:
            expense = self.get_expense_by_txn_id(txn.metadata['id'])

            if not expense or len(suggestions) == 2:
                continue

            # prompt_value = PROMPT.format(
            #     bank_transaction=transaction['description'],
            #     expense_name=expense['name'],
            #     expense_category=expense['categoryName'],
            #     expense_amount=expense['amount']
            # )
            # # Use llm to suggest a description
            #
            # llm_response = llm.invoke(prompt_value)
            # structured_llm_response = parser.invoke(llm_response)
            # print("LLM response: ", structured_llm_response)
            # # llm_suggestion = json.loads(structured_llm_response)
            # suggested_description = structured_llm_response.description
            #
            # print("Suggested description: ", suggested_description)
            # expense['description'] = suggested_description

            expense['bankTransactionId'] = bank_transaction_id

            if expense['amount'] > transaction['amount']:
                expense['amount'] = abs(transaction['amount'])
            else:
                expense['amount'] = abs(expense['amount'])
            expense['score'] = score

            suggestions.append(expense)


        expenses_by_similar_txn_amount = self.get_expense_by_similar_txn_amount(transaction['amount'])
        for expense in expenses_by_similar_txn_amount:
            expense['bankTransactionId'] = bank_transaction_id

            if expense['amount'] > transaction['amount']:
                expense['amount'] = abs(transaction['amount'])
            else:
                expense['amount'] = abs(expense['amount'])

            suggestions.append(expense)

        # similar_transaction = vector_search.similarity_search(
        #     query=transaction['description'],
        #     k=10
        # )
        #
        # for txn in similar_transaction:
        #     print(txn)
        #
        # similar_transaction_ids = [txn.metadata['id'] for txn in similar_transaction]
        #
        # suggestions = get_expense_by_txn_ids(similar_transaction_ids)

        return suggestions

