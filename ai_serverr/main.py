from fastapi import FastAPI
from sqlalchemy.orm import defer
# from experiment import get_workflow
from fastapi.middleware.cors import CORSMiddleware
from ai_agent import AIAgent
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

agent = AIAgent()

@app.get("/expense/suggestion/")
async def suggest_expense(bankTransactionId: str, userId: str):
    '''
    :param bankTransactionId:
    :param userId:
    :return:
        expense = {
            "name": "Coffee at Starbucks",
            "description": "Morning coffee",
            "amount": -5.50,
            "categoryId": "1"
        }
    '''

    # inputs = {
    #     "transaction_id": "tx123"
    # }
    #
    # workflow = get_workflow()
    #
    # result = workflow.invoke(inputs)

    suggested_expense = agent.get_suggestion(bankTransactionId)

    return suggested_expense
