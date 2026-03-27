from typing import List, Tuple

from common.process_resource_event import EventData
from consumer.image.dimensions import get_image_width_and_height
from consumer.worker import ImageWorker, WorkerImageMetadataResult

prompt = "\n".join([
    "Retain the image exactly the same and remove all text but keep labels",
])


class ImageRemoveTextWorker(ImageWorker):
    def process(
            self, data: EventData, input_buffer: bytes, input_metadata: dict
    ) -> Tuple[List[bytes], WorkerImageMetadataResult]:
        service = self.container['image_generation_service']
        buffer = service.nano_banana_image_to_image(input_buffer, prompt)
        width, height = get_image_width_and_height(buffer)
        metadata: WorkerImageMetadataResult = {
            'width': width,
            'height': height
        }
        return [buffer], metadata
