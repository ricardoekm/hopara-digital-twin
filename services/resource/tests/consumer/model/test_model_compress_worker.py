import unittest
from typing import Any, cast

from common.path import path_join
from common.process_resource_event import EventData
from consumer.model.model_compress_worker import ModelCompressWorker
from consumer.model.model_service import ModelService
from tests.test_utils import TEST_ROOT

worker = ModelCompressWorker(cast(Any, { 'model_service': ModelService()}))
any_event_data: EventData = cast(EventData, {})


class TestModelCompressWorker(unittest.TestCase):
    def test_process_glb(self):
        file_path = path_join(TEST_ROOT, 'fixtures/sample.glb')
        with open(file_path, 'rb+') as fp:
            input_buffer = fp.read()
            buffers, metadata = worker.process(any_event_data, input_buffer, {'mimetype': 'model/gltf-binary'})
            self.assertEqual(len(input_buffer), 1936)
            self.assertGreater(len(buffers[0]), 1000)
            self.assertLess(len(buffers[0]), 1500)

    def test_process_fbx(self):
        file_path = path_join(TEST_ROOT, 'fixtures/sample.fbx')
        data = cast(EventData, {"extension": ".fbx"})
        with open(file_path, 'rb+') as fp:
            input_buffer = fp.read()
            buffers, metadata = worker.process(data, input_buffer, {'mimetype': 'application/fbx'})
            self.assertEqual(len(input_buffer), 26716)
            self.assertGreater(len(buffers[0]), 1000)
            self.assertLess(len(buffers[0]), 1565)
