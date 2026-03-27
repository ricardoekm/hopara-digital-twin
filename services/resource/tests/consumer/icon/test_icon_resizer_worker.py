import unittest
from typing import Any, cast

from common.errors import UnsupportedFileError
from common.path import path_join
from common.process_resource_event import EventData
from consumer.icon.icon_resize_worker import IconResizeWorker
from tests.test_utils import TEST_ROOT, get_storage

worker = IconResizeWorker(cast(Any, {}))

any_event_data: EventData = cast(EventData, {})


class TestIconResizeWorker(unittest.TestCase):
    def setUp(self):
        self.storage = get_storage()

    def test_process_svg(self):
        file_path = path_join(TEST_ROOT, 'fixtures/sample.svg')
        with open(file_path, 'rb+') as fp:
            buffers, metadata = worker.process(any_event_data, fp.read(), {'mimetype': 'image/svg+xml'})
            self.assertEqual(256, metadata['width'])
            self.assertEqual(256, metadata['height'])
            self.assertGreater(len(buffers[0]), 4500)

    def test_unsupported_format(self):
        file_path = path_join(TEST_ROOT, 'fixtures/sample.pdf')
        with open(file_path, 'rb+') as fp:
            with self.assertRaises(UnsupportedFileError):
                worker.process(any_event_data, fp.read(), {'mimetype': 'model/gltf-binary'})

    def test_process_png(self):
        file_path = path_join(TEST_ROOT, 'fixtures/sample_icon.png')
        with open(file_path, 'rb+') as fp:
            buffer = fp.read()
            buffers, metadata = worker.process(any_event_data, buffer)
            self.assertEqual(256, metadata['width'])
            self.assertEqual(256, metadata['height'])
            self.assertGreater(len(buffers[0]), 1500)

    def test_process_not_squared_png(self):
        file_path = path_join(TEST_ROOT, 'fixtures/sample_not_squared_icon.png')
        with open(file_path, 'rb+') as fp:
            buffer = fp.read()
            buffers, metadata = worker.process(any_event_data, buffer)
            self.assertEqual(256, metadata['width'])
            self.assertEqual(256, metadata['height'])
            self.assertGreater(len(buffers[0]), 2000)

    def test_process_without_mimetype(self):
        file_path = path_join(TEST_ROOT, 'fixtures/sample.png')
        with open(file_path, 'rb+') as fp:
            buffers, metadata = worker.process(any_event_data, fp.read(), {})
            self.assertEqual(256, metadata['width'])
            self.assertEqual(256, metadata['height'])
            self.assertEqual(544, len(buffers[0]))
