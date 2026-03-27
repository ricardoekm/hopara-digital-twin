import unittest

from common.resolution import Resolution
from consumer.image.image_utils import get_image_dimensions

DEFAULT_MAX_TEXTURE_SIZE = Resolution.default()[1]


class ImageUtilsTestCase(unittest.TestCase):
    def test_get_image_dimensions(self):
        self.assertEqual(get_image_dimensions(4096, 4096, DEFAULT_MAX_TEXTURE_SIZE), (4096, 4096))
        self.assertEqual(get_image_dimensions(4096, 2048, DEFAULT_MAX_TEXTURE_SIZE), (4096, 2048))
        self.assertEqual(get_image_dimensions(2048, 4096, DEFAULT_MAX_TEXTURE_SIZE), (2048, 4096))

        self.assertEqual(get_image_dimensions(8192, 8192, DEFAULT_MAX_TEXTURE_SIZE), (4096, 4096))
        self.assertEqual(get_image_dimensions(8192, 4096, DEFAULT_MAX_TEXTURE_SIZE), (4096, 2048))
        self.assertEqual(get_image_dimensions(4096, 8192, DEFAULT_MAX_TEXTURE_SIZE), (2048, 4096))

        self.assertEqual(get_image_dimensions(5148, 3700, DEFAULT_MAX_TEXTURE_SIZE), (4096, 2943))
        self.assertEqual(get_image_dimensions(7852, 5000, DEFAULT_MAX_TEXTURE_SIZE), (4096, 2608))

        self.assertEqual(get_image_dimensions(40960, 20480, DEFAULT_MAX_TEXTURE_SIZE), (4096, 2048))

        self.assertEqual(get_image_dimensions(40960, 20480, 100), (100, 50))
