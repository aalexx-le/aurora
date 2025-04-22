import asyncio
from collections.abc import Sequence
from functools import partial
from typing import Any

from asgiref.sync import sync_to_async
from airflow.models.connection import Connection
from airflow.exceptions import AirflowException
from airflow.triggers.base import BaseTrigger, TriggerEvent
from airflow.utils.module_loading import import_string
from aiokafka import AIOKafkaConsumer
import logging
from airflow.hooks.base import BaseHook

logger = logging.getLogger(__name__)

class AwaitMessageTrigger(BaseTrigger):

    def __init__(
        self,
        topics: Sequence[str],
        apply_function: str,
        kafka_config_id: str = "kafka_default",
        apply_function_args: Sequence[Any] | None = None,
        apply_function_kwargs: dict[Any, Any] | None = None,
        poll_timeout: float = 1,
        poll_interval: float = 5,
    ) -> None:
        self.topics = topics
        self.apply_function = apply_function
        self.apply_function_args = apply_function_args or ()
        self.apply_function_kwargs = apply_function_kwargs or {}
        self.kafka_config_id = kafka_config_id
        self.poll_timeout = poll_timeout
        self.poll_interval = poll_interval

        logger.info("Initializing AwaitMessageTrigger")

    def serialize(self) -> tuple[str, dict[str, Any]]:
        return (
            "triggers.kafka_triggers.AwaitMessageTrigger",
            {
                "topics": self.topics,
                "apply_function": self.apply_function,
                "apply_function_args": self.apply_function_args,
                "apply_function_kwargs": self.apply_function_kwargs,
                "kafka_config_id": self.kafka_config_id,
                "poll_timeout": self.poll_timeout,
                "poll_interval": self.poll_interval,
            },
        )

    async def run(self):
        conn = BaseHook.get_connection('kafka_default')
        kafka_config = {
            'bootstrap_servers': conn.extra_dejson.get('bootstrap.servers'),
            'client_id': conn.extra_dejson.get('client.id'),
            'group_id': conn.extra_dejson.get('group.id'),
        }
        
        logger.info(f"Connect to kafka_default: {conn.get_extra_dejson()}")
        consumer = AIOKafkaConsumer(
            *self.topics,
            **kafka_config,
            enable_auto_commit=False,
            auto_offset_reset="earliest"
        )
        
        try:
            # Start the consumer
            await consumer.start()
            
            logger.info("Consumer started")

            processing_call = import_string(self.apply_function)
            processing_call = partial(processing_call, *self.apply_function_args, **self.apply_function_kwargs)
            async_message_process = sync_to_async(processing_call)

            while True:
                try:
                    message = await consumer.getone()
                    logger.info(f"Received message: {message}")
                    if message is None:
                        continue
                    
                    rv = await async_message_process(message)
                    if rv:
                        await consumer.commit()
                        yield TriggerEvent(rv)
                        break
                    else:
                        await asyncio.sleep(self.poll_interval)
                        
                except Exception as e:
                    raise AirflowException(f"Error processing message: {e}")
                
        finally:
            # Ensure consumer is closed properly
            await consumer.stop() 