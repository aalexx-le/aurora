from langgraph.graph import Graph
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from langchain.tools import BaseTool
from langchain.prompts import PromptTemplate
from langchain_community.llms import Ollama
import json
import numpy as np
from typing import Dict
from utils.connection import get_connection
from utils.sql_scripts import get_query_sql_script, get_all_query_sql_script

GET_BANK_TRANSACTIONS = get_all_query_sql_script("bank_transactions", ["id", "amount", "description", "spentAmount"])


def get_workflow():
    class Database:
        def __init__(self):
            self.conn = get_connection()
            self.cur = self.conn.cursor()

        def get_bank_transaction(self, transaction_id: str):
            return self.cur.execute(GET_BANK_TRANSACTIONS).fetchall()

        def get_expense_categories(self):
            return self.cur.execute(GET_ALL_SQL_SCRIPT).fetchall()

        def get_existing_expenses(self):
            return self.existing_expenses

    # Example data
    db = Database()
    db.bank_transactions = {
        "tx123": {"id": "tx123", "details": "Starbucks - Coffee", "amount": -5.50, "date": "2024-10-27"},
        "tx456": {"id": "tx456", "details": "Amazon - Books", "amount": -25.00, "date": "2024-10-26"},
        "tx789": {"id": "tx789", "details": "Grocery Store", "amount": -100.00, "date": "2024-10-25"},
    }
    db.expense_categories = {
        "cat1": {"id": "cat1", "name": "Food"},
        "cat2": {"id": "cat2", "name": "Shopping"},
        "cat3": {"id": "cat3", "name": "Groceries"},
    }
    db.existing_expenses = [
        {"name": "Lunch at Cafe X", "description": "Business lunch", "amount": -20.00, "category": "Business Meals"},
        {"name": "Office Supplies", "description": "Pens and paper", "amount": -15.50, "category": "Office Supplies"},
        {"name": "Grocery Shopping", "description": "Weekly groceries", "amount": -120.00, "category": "Groceries"},
        {"name": "Coffee", "description": "Daily coffee", "amount": -4.50, "category": "Food"},
    ]

    # Tools
    class GetBankTransactionTool(BaseTool):
        name: str = "get_bank_transaction"  # Explicit type annotation
        description: str = (
            "Retrieves bank transaction details given a transaction ID. Input should be a valid transaction ID."
        )

        def _run(self, transaction_id: str) -> str:
            transaction = db.get_bank_transaction(transaction_id)
            if transaction:
                return json.dumps(transaction)
            return "Transaction not found."

        async def _arun(self, transaction_id: str) -> str:
            return self._run(transaction_id)


    class GetExpenseCategoriesTool(BaseTool):
        name: str = "get_expense_categories"  # Explicit type annotation
        description: str = "Retrieves a list of available expense categories."

        def _run(self) -> str:
            categories = db.get_expense_categories()
            return json.dumps(categories)

        async def _arun(self) -> str:
            return self._run()


    class GetExistingExpensesTool(BaseTool):
        name: str = "get_existing_expenses"  # Explicit type annotation
        description: str = "Retrieves existing expenses from the database."

        def _run(self) -> str:
            return json.dumps(db.get_existing_expenses())

        async def _arun(self) -> str:
            return self._run()

    # LLM setup
    llm = Ollama(model="llama3.1")

    # Prompt
    prompt_template = """
    You are an expense categorization agent. Given a bank transaction and available expense categories, suggest the expense details.
    
    Bank Transaction:
    {bank_transaction}
    
    Available Expense Categories:
    {expense_categories}
    
    Provide your response as a JSON object with the following keys: name, description, amount, category.
    
    Example:
    ```json
    {{
      "name": "Coffee at Starbucks",
      "description": "Morning coffee",
      "amount": -5.50,
      "category": "Food"
    }}
    ```
    """

    PROMPT = PromptTemplate(
        template=prompt_template, input_variables=["bank_transaction", "expense_categories"]
    )

    def get_similar_expenses(new_transaction_details, existing_expenses):
        if not existing_expenses:
            return []

        descriptions = [exp["description"] or "" for exp in existing_expenses]
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(descriptions + [new_transaction_details])
        similarity_scores = cosine_similarity(tfidf_matrix[-1:], tfidf_matrix[:-1])[0]

        # Get indices of top 3 similar expenses
        top_indices = np.argsort(similarity_scores)[::-1][:3]
        similar_expenses = [existing_expenses[i] for i in top_indices]
        return similar_expenses

    def suggest_expense(state: Dict) -> Dict:
        print(f"State received in suggest_expense: {state}")  # Debugging log
        if "tool_response" not in state:
            return {"response": "Error: 'tool_response' missing in state."}
        if state["tool_response"].content == "Transaction not found.":
            return {"response": "Transaction not found. Cannot suggest expense."}

        bank_transaction = json.loads(state["tool_response"].content)
        categories = json.loads(state["categories_response"].content)
        existing_expenses = json.loads(state["existing_expenses_response"].content)

        similar_expenses = get_similar_expenses(bank_transaction.get("details", ""), existing_expenses)

        prompt_value = PROMPT.format(
            bank_transaction=bank_transaction,
            expense_categories=categories,
            similar_expenses=similar_expenses,
        )
        llm_response = llm(prompt_value)
        try:
            expense_suggestion = json.loads(llm_response)  # Parse the LLM response as JSON
            return {"response": expense_suggestion}
        except json.JSONDecodeError:
            return {"response": f"LLM returned invalid JSON: {llm_response}"}


    workflow = Graph()
    workflow.add_node("get_transaction", lambda x: {"tool_response": GetBankTransactionTool()._run(x["transaction_id"])})
    workflow.add_node("get_categories", lambda x: {"categories_response": GetExpenseCategoriesTool()._run()})
    workflow.add_node("get_existing_expenses", lambda x: {"existing_expenses_response": GetExistingExpensesTool()._run()})
    workflow.add_node("suggest_expense", suggest_expense)

    workflow.add_edge("get_transaction", "get_categories")
    workflow.add_edge("get_categories", "get_existing_expenses")
    workflow.add_edge("get_existing_expenses", "suggest_expense")

    workflow.set_entry_point("get_transaction")
    compiled_workflow = workflow.compile()

    return compiled_workflow

inputs = {"transaction_id": "tx123"}
compiled_workflow = get_workflow()
result = compiled_workflow.invoke(inputs)
print(result)
#
# inputs_not_found = {"transaction_id": "nonexistent"}
# result_not_found = compiled_workflow.invoke(inputs_not_found)
# print(result_not_found)
#
# inputs2 = {"transaction_id": "tx789"}
# result2 = compiled_workflow.invoke(inputs2)
# print(result2)
