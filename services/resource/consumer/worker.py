from abc import ABC, abstractmethod
from typing import Any, List, TypedDict

from common.process_resource_event import EventData


class ConsumerContainer(TypedDict):
    image_generation_service: Any
    model_generation_service: Any
    model_service: Any


class Worker(ABC):
    consumer_container: ConsumerContainer

    def __init__(self, container: ConsumerContainer):
        self.container = container

    @abstractmethod
    def process(self, data: EventData, input_buffer: bytes, input_metadata: dict) -> tuple[List[bytes], Any]:
        pass


class WorkerImageMetadataResult(TypedDict):
    width: int
    height: int


class ImageWorker(Worker):
    @abstractmethod
    def process(
            self, data: EventData, input_buffer: bytes, input_metadata: dict
    ) -> tuple[List[bytes], WorkerImageMetadataResult]:
        pass
