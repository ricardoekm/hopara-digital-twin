import unittest
from typing import Any, cast

from common.errors import UnsupportedFileError
from common.path import path_join
from common.process_resource_event import EventData
from consumer.image.image_resize_worker import ImageResizeWorker
from tests.test_utils import TEST_ROOT

worker = ImageResizeWorker(cast(Any, {}))

any_event_data: EventData = cast(EventData, {"max_size": 4096})


class ImageResizeWorkerTest(unittest.TestCase):
    def test_process_pdf(self):
        file_path = path_join(TEST_ROOT, 'fixtures/sample.pdf')
        with open(file_path, 'rb+') as fp:
            buffers, metadata = worker.process(any_event_data, fp.read(), {'mimetype': 'application/pdf'})
            self.assertEqual(metadata, {
                'width': 3165,
                'height': 4096,
            })

            self.assertGreater(len(buffers[0]), 120000)

    def test_process_svg(self):
        file_path = path_join(TEST_ROOT, 'fixtures/sample.svg')
        with open(file_path, 'rb+') as fp:
            buffers, metadata = worker.process(any_event_data, fp.read(), {})
            self.assertEqual(metadata, {
                'width': 4096,
                'height': 4096,
            })
            self.assertGreater(len(buffers[0]), 84000)

    def test_process_png(self):
        file_path = path_join(TEST_ROOT, 'fixtures/sample.png')
        with open(file_path, 'rb+') as fp:
            buffers, metadata = worker.process(any_event_data, fp.read(), {'mimetype': 'image/png'})
            self.assertEqual(metadata, {
                'width': 2891,
                'height': 1807,
            })
            self.assertGreater(len(buffers[0]), 63000)

    def test_process_jpg_with_exif(self):
        file_path = path_join(TEST_ROOT, 'fixtures/with_rotation.jpg')
        data = cast(EventData, {"max_size": 4096})
        with open(file_path, 'rb+') as fp:
            buffers, metadata = worker.process(data, fp.read(), {'mimetype': 'image/png'})
            self.assertEqual({
                'width': 3072,
                'height': 4080,
            }, metadata)
            self.assertGreater(len(buffers[0]), 63000)

    def test_process_heic(self):
        file_path = path_join(TEST_ROOT, 'fixtures/sample.heic')
        with open(file_path, 'rb+') as fp:
            buffers, metadata = worker.process(any_event_data, fp.read(), {'mimetype': 'image/heic'})
            self.assertEqual(metadata, {
                'width': 4000,
                'height': 3000,
            })
            self.assertGreater(len(buffers[0]), 300000)

    def test_process_unsupported(self):
        file_path = path_join(TEST_ROOT, 'fixtures/sample.glb')
        with open(file_path, 'rb+') as fp:
            with self.assertRaises(UnsupportedFileError):
                worker.process(any_event_data, fp.read(), {'mimetype': 'model/gltf-binary'})

    def test_process_without_mime_type(self):
        file_path = path_join(TEST_ROOT, 'fixtures/sample_color.jpg')
        with open(file_path, 'rb+') as fp:
            buffers, metadata = worker.process(any_event_data, fp.read(), {})
            self.assertEqual(metadata, {
                'width': 400,
                'height': 267,
            })
            self.assertGreater(len(buffers[0]), 17000)
