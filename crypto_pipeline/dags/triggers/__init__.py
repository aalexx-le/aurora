# Make triggers a proper Python package
from .kafka_triggers import AwaitMessageTrigger

__all__ = ['AwaitMessageTrigger'] 