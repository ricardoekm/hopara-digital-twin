import json
from typing import List

from common.process_resource_event import EventData
from consumer.image.get_image_polygon import get_image_polygon
from consumer.worker import Worker


class ImageToShapeWorker(Worker):
    def process(self, data: EventData, input_buffer: bytes, input_metadata: dict) -> tuple[List[bytes], None]:
        polygon, bounds = get_image_polygon(input_buffer)
        if len(polygon) == 0: raise ValueError('No polygon found')
        return [json.dumps({'polygon': polygon.tolist(), 'bounds': bounds.tolist()}).encode()], None
