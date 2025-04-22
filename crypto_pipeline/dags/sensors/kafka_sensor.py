import json
import logging
from typing import Any
from collections.abc import Sequence
from airflow.models import BaseOperator
from airflow.utils.decorators import apply_defaults
from triggers.kafka_triggers import AwaitMessageTrigger

logger = logging.getLogger(__name__)

class AwaitMessageSensor(BaseOperator):
    """
    An Airflow sensor that defers until a specific message is published to Kafka.

    The sensor creates a consumer that reads the Kafka log until it encounters a positive event.

    The behavior of the consumer for this trigger is as follows:
    - poll the Kafka topics for a message
    - if no message returned, sleep
    - process the message with provided callable and commit the message offset
    - if callable returns any data, raise a TriggerEvent with the return data
    - else continue to next message
    - return event (as default xcom or specific xcom key)


    :param kafka_config_id: The connection object to use, defaults to "kafka_default"
    :param topics: Topics (or topic regex) to use for reading from
    :param apply_function: The function to apply to messages to determine if an event occurred. As a dot
        notation string.
    :param apply_function_args: Arguments to be applied to the processing function,
        defaults to None
    :param apply_function_kwargs: Key word arguments to be applied to the processing function,
        defaults to None
    :param poll_timeout: How long the kafka consumer should wait for a message to arrive from the kafka
        cluster,defaults to 1
    :param poll_interval: How long the kafka consumer should sleep after reaching the end of the Kafka log,
        defaults to 5
    :param xcom_push_key: the name of a key to push the returned message to, defaults to None
    :param store_xcoms: Whether to store XComs collected by the trigger in the Airflow database, defaults to True

    """

    BLUE = "#ffefeb"
    ui_color = BLUE

    template_fields = (
        "topics",
        "apply_function",
        "apply_function_args",
        "apply_function_kwargs",
        "kafka_config_id",
    )

    def __init__(
        self,
        topics: Sequence[str],
        apply_function: str,
        kafka_config_id: str = "kafka_default",
        apply_function_args: Sequence[Any] | None = None,
        apply_function_kwargs: dict[Any, Any] | None = None,
        poll_timeout: float = 1,
        poll_interval: float = 5,
        xcom_push_key=None,
        store_xcoms: bool = True,
        **kwargs: Any,
    ) -> None:
        super().__init__(**kwargs)

        self.topics = topics
        self.apply_function = apply_function
        self.apply_function_args = apply_function_args
        self.apply_function_kwargs = apply_function_kwargs
        self.kafka_config_id = kafka_config_id
        self.poll_timeout = poll_timeout
        self.poll_interval = poll_interval
        self.xcom_push_key = xcom_push_key
        self.store_xcoms = store_xcoms

    def execute(self, context) -> Any:
        logger.info("Start sensor")
        
        self.defer(
            trigger=AwaitMessageTrigger(
                topics=self.topics,
                apply_function=self.apply_function,
                apply_function_args=self.apply_function_args,
                apply_function_kwargs=self.apply_function_kwargs,
                kafka_config_id=self.kafka_config_id,
                poll_timeout=self.poll_timeout,
                poll_interval=self.poll_interval,
            ),
            method_name="execute_complete",
        )

    def execute_complete(self, context, event=None):
        logger.info(f"Received event from trigger: {event}")
        
        # The event now contains {result: original_result, xcoms: {key: value}}
        # Extract the result and any XComs
        result = event.get("result", False) if isinstance(event, dict) else event
        xcoms = event.get("xcoms", {}) if isinstance(event, dict) else {}
        
        # Store any XComs from the trigger in the task's XCom
        if self.store_xcoms and xcoms and isinstance(xcoms, dict):
            for key, value in xcoms.items():
                if isinstance(key, str):
                    # Extract just the key part without the dag_id.task_id prefix
                    xcom_key = key.split(".")[-1] if "." in key else key
                    logger.info(f"Storing XCom from trigger: {xcom_key}")
                    self.xcom_push(context, key=xcom_key, value=value)
        
        if self.xcom_push_key:
            self.xcom_push(context, key=self.xcom_push_key, value=result)
        
        return result