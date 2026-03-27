from typing import List, cast

from common.crop import CropArea
from common.mimetype import discover_mimetype
from common.process_resource_event import EventData
from consumer.image.dimensions import get_width_and_height
from consumer.image.image_utils import (crop_image, discover_extension,
                                        get_crop_area)
from consumer.worker import ImageWorker, WorkerImageMetadataResult


class ImageCropWorker(ImageWorker):
    def process(
            self, data: EventData, input_buffer: bytes, input_metadata: dict
    ) -> tuple[List[bytes], WorkerImageMetadataResult]:
        crop_area = cast(CropArea, data.get('crop_area'))
        mimetype = discover_mimetype(input_buffer)
        extension = discover_extension(mimetype)
        width, height = get_width_and_height(input_buffer, extension)
        crop_area_list = None
        if crop_area:
            crop_area_list = get_crop_area(crop_area, width, height)
        buffer, width, height = crop_image(
            input_buffer,
            file_ext=extension,
            crop_area=crop_area_list,
        )
        if not buffer:
            raise ValueError(f'Failed to convert input buffer to image with extension {extension}')
        metadata: WorkerImageMetadataResult = {
            'width': width,
            'height': height,
        }
        return [buffer], metadata
