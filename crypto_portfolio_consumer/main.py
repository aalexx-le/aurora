import asyncio
import json
import logging
import os
from contextlib import asynccontextmanager
from datetime import datetime

import coloredlogs
import uvicorn
from aiokafka import AIOKafkaConsumer, AIOKafkaProducer
from crypto_portfolio_creator import CryptoPortfolioCreator
from dotenv import load_dotenv
from fastapi import FastAPI

load_dotenv()

coloredlogs.install()
logging.basicConfig(level=logging.INFO)

async def crypto_portfolio_consume():
    CONSUMER_GROUP = "python-crypto-consumer"
    BROKER_SERVER = os.getenv('MESSAGE_BROKER_URL')
    TOPIC_NAME= "create-crypto-portfolio"
    consumer = AIOKafkaConsumer(
        TOPIC_NAME,
        # client_id="python-client",
        group_id=CONSUMER_GROUP,
        bootstrap_servers=[BROKER_SERVER],
        # api_version=(0,11,5),
        value_deserializer=lambda v: json.loads(v),
        key_deserializer=lambda v: json.loads(v) if v is not None else v ,
        # max_poll_records=10,
        auto_offset_reset="latest",
        enable_auto_commit=True,
        # session_timeout_ms=6000,
        # heartbeat_interval_ms=3000,
    )

    producer = AIOKafkaProducer(
        bootstrap_servers=[BROKER_SERVER],
    )


    # consumer.subscribe(topics=["Test-nest"])
    creator = CryptoPortfolioCreator(producer=producer)

    await consumer.start()
    try:
        async for message in consumer:
            try:
                logging.info(f"Processing: {message.value}")
                
                creator.create(message.value)
                
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
    asyncio.create_task(crypto_portfolio_consume())
    yield

app = FastAPI(lifespan=startup_event)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5999, log_level="info")