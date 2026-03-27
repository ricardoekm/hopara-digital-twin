import logging
from typing import List

from common.dictionary import get_with_default
from common.process_resource_event import EventData
from consumer.worker import Worker


class ModelCompressWorker(Worker):
    def process(self, data: EventData, input_buffer: bytes, input_metadata: dict) -> tuple[List[bytes], None]:
        buffer = input_buffer
        extension = get_with_default(data, 'extension', '.glb')
        compress = get_with_default(data, 'compressed_gltf', True)
        compression_level = get_with_default(data, 'compression_level', 6)
        reset_centroid = get_with_default(data, 'reset_centroid', True)
        try:
            if not compress:
                compression_level = 0
            modified_files = self.container['model_service'].compress(buffer, extension, compression_level, reset_centroid)
        except Exception as error:
            logging.exception(f'Error generating compressed model "{error=}". Using uncompressed version.')
            compression_level = 0
            modified_files = self.container['model_service'].compress(buffer, extension, compression_level, reset_centroid)
        return modified_files, None
