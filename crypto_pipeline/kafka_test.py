from aiokafka import AIOKafkaConsumer
import asyncio

async def consume_messages():
    # Create consumer
    consumer = AIOKafkaConsumer(
        "create-crypto-portfolio",
        bootstrap_servers="localhost:29091",
        enable_auto_commit=False,
        auto_offset_reset="earliest"
    )
    
    # Start the consumer
    await consumer.start()

    print("Consumer started")
    
    try:
        # Consume messages
        async for msg in consumer:
            print(f"Consumed: {msg.topic}, {msg.partition}, {msg.offset}, {msg.key}, {msg.value}")
            await consumer.commit()
    finally:
        # Close the consumer
        await consumer.stop()

if __name__ == "__main__":
    # Run the async function with asyncio
    asyncio.run(consume_messages())