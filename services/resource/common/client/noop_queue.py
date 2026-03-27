from typing import List

from common.client.queue import Queue
from common.process_resource_event import ResourceStep


class NoOpQueue(Queue):
    def receive_messages(self) -> list:
        return []

    def delete_message(self, message) -> None:
        return None

    def send_message(self, payload) -> str | None:
        return None

    def send_messages(self, payloads: List[ResourceStep]) -> None:
        return None
    
    def get_name(self) -> str:
        return "NoOpQueue"
