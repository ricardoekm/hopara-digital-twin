from typing import List

from common.errors import UnsupportedFileError
from common.mimetype import discover_mimetype
from common.process_resource_event import EventData
from consumer.image.image_utils import (get_image_dimensions, open_image,
                                        remove_brightness,
                                        resize_image_to_square, to_image)
from consumer.worker import ImageWorker, WorkerImageMetadataResult

DEFAULT_ICON_SIZE = 256


class IconResizeWorker(ImageWorker):
    def process(
            self, data: EventData, input_buffer: bytes, input_metadata: dict | None = None
    ) -> tuple[List[bytes], WorkerImageMetadataResult]:
        mimetype = discover_mimetype(input_buffer)
        if mimetype == 'image/svg+xml':
            buffer, width, height = to_image(input_buffer, DEFAULT_ICON_SIZE, 'svg')
            img = open_image(buffer)
        else:
            try:
                img = open_image(input_buffer)
                width = img.size[0]
                height = img.size[1]
            except Exception:
                raise UnsupportedFileError(mimetype)

        image_size = (width, height)
        new_width, new_height = get_image_dimensions(*image_size, DEFAULT_ICON_SIZE)
        max_size = max(new_width, new_height)
        img = resize_image_to_square(img, max_size)

        buffer = remove_brightness(img)
        metadata: WorkerImageMetadataResult = {
            'width': max_size,
            'height': max_size,
        }
        return [buffer], metadata
