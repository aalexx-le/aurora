from enum import Enum


class CreateExecutionStatus(str, Enum):
    QUEUE = "QUEUE"
    PROCESSING = "PROCESSING"
    FAILED = "FAILED"
    SUCCESS = "SUCCESS" 