from typing import List

from common.process_resource_event import EventData
from common.resolution import Resolution
from consumer.image.dimensions import get_image_width_and_height
from consumer.worker import ImageWorker, WorkerImageMetadataResult


class ModelToImageWorker(ImageWorker):
    def process(
            self, data: EventData, input_buffer: bytes, input_metadata: dict
    ) -> tuple[List[bytes], WorkerImageMetadataResult]:
        angles = data.get('angles', [45]) or []
        resolution = data.get('resolution', Resolution.default())
        size = Resolution.get_size(resolution)
        buffers = self.container['model_service'].to_images(input_buffer, angles, size=size)
        width, height = get_image_width_and_height(buffers[0])
        metadata: WorkerImageMetadataResult = {
            'width': width,
            'height': height
        }
        return buffers, metadata
