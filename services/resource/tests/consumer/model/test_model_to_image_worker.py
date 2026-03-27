import unittest
from typing import Any, cast

from common.path import path_join
from common.process_resource_event import EventData
from consumer.model.model_service import ModelService
from consumer.model.model_to_image_worker import ModelToImageWorker
from tests.test_utils import TEST_ROOT

worker = ModelToImageWorker(cast(Any, {
    'model_service': ModelService()
}))
any_event_data: EventData = cast(EventData, {})


class TestModelToImageWorker(unittest.TestCase):
    def test_process(self):
        file_path = path_join(TEST_ROOT, 'fixtures/sample.glb')
        with open(file_path, 'rb+') as fp:
            input_buffer = fp.read()
            buffers, metadata = worker.process(any_event_data, input_buffer, {'mimetype': 'model/gltf-binary'})
            self.assertEqual({'height': 4096, 'width': 4096}, metadata)
            self.assertEqual(len(input_buffer), 1936)
            self.assertGreater(len(buffers[0]), 55000)
