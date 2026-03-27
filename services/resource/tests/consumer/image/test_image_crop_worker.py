import unittest
from typing import Any, cast

from common.path import path_join
from common.process_resource_event import EventData
from consumer.image.image_crop_worker import ImageCropWorker
from tests.test_utils import TEST_ROOT

worker = ImageCropWorker(cast(Any, {}))

any_event_data: EventData = cast(EventData, {"max_size": 4096})


class ImageCropWorkerTest(unittest.TestCase):
    def test_process_crop(self):
        # imagem original 2891x1807
        data = cast(EventData, {
            # crop 10% width and height from the center
            "crop_area": {'left': .45, 'right': .45, 'bottom': .45, 'top': .45}
        })
        file_path = path_join(TEST_ROOT, 'fixtures/sample.png')
        with open(file_path, 'rb+') as fp:
            bytes, metadata = worker.process(data, fp.read(), {'mimetype': 'application/pdf'})
            self.assertTrue(bytes)
            self.assertEqual({
                'width': 290,
                'height': 180,
            }, metadata)

    def test_process_crop_with_phys_should_not_crop_wrong_area(self):
        data = cast(EventData, {
            "crop_area": {'left': .45, 'right': .45, 'bottom': .45, 'top': .45}
        })
        with open(path_join(TEST_ROOT, 'fixtures/no_exif.png'), 'rb+') as fp:
            no_exif_bytes, metadata = worker.process(data, fp.read(), {'mimetype': 'application/pdf'})
        with open(path_join(TEST_ROOT, 'fixtures/with_exif.png'), 'rb+') as fp:
            exif_bytes, metadata = worker.process(data, fp.read(), {'mimetype': 'application/pdf'})
        self.assertEqual(no_exif_bytes, exif_bytes)
