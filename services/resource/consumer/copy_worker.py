from typing import List

from common.process_resource_event import EventData
from consumer.worker import Worker


class CopyWorker(Worker):
    def process(self, data: EventData, input_buffer: bytes, input_metadata: dict) -> tuple[List[bytes], None]:
        destinations = data.get('destinations', []) or []
        destination = data.get('destination', None)
        if destination:
            destinations.append(destination)

        return [input_buffer for i in destinations], None
