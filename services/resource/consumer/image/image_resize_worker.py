from typing import List

from common.dictionary import get_with_default
from common.mimetype import discover_mimetype
from common.process_resource_event import EventData
from consumer.image.image_utils import discover_extension, to_image
from consumer.worker import ImageWorker, WorkerImageMetadataResult


class ImageResizeWorker(ImageWorker):
    def process(
            self, data: EventData, input_buffer: bytes, input_metadata: dict
    ) -> tuple[List[bytes], WorkerImageMetadataResult]:
        max_size = get_with_default(data, 'max_size', 0)
        mimetype = discover_mimetype(input_buffer)
        extension = discover_extension(mimetype)
        output_buffer, width, height = to_image(input_buffer, max_size, extension)
        metadata: WorkerImageMetadataResult = {
            'width': width,
            'height': height
        }
        return [output_buffer], metadata
