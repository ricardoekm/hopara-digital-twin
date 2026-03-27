import json
import unittest
from typing import Any, cast

from common.path import path_join
from common.process_resource_event import EventData
from consumer.image.image_to_shape_worker import ImageToShapeWorker
from tests.test_utils import TEST_ROOT

input_bytes = b'fake_image_data'
output_bytes = b'processed_image_data'

worker = ImageToShapeWorker(cast(Any, {}))


class TestImageToShapeWorker(unittest.TestCase):
    def test_process(self):
        data = cast(EventData, {})
        file_path = path_join(TEST_ROOT, 'fixtures/sample.png')
        with open(file_path, 'rb+') as fp:
            buffers, metadata = worker.process(data, fp.read(), {})
            shape = json.loads(buffers[0])
            self.assertLess(len(shape["polygon"]), 300)
            self.assertEqual(len(shape["bounds"]), 5)
