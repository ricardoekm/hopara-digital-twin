from abc import ABC, abstractmethod
from typing import List

from common.process_resource_event import ResourceStep


class Queue(ABC):
    @abstractmethod
    def get_name(self) -> str:
        ...

    @abstractmethod
    def receive_messages(self) -> list:
        ...

    @abstractmethod
    def delete_message(self, message) -> None:
        ...

    @abstractmethod
    def send_message(self, payload) -> str | None:
        ...

    @abstractmethod
    def send_messages(self, payloads: List[ResourceStep]) -> None:
        ...
