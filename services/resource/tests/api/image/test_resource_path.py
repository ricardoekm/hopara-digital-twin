import unittest

from common.resource_path import ResourcePath


class TestResourcePath(unittest.TestCase):
    def resource_library_base_path(self):
        self.assertEqual(
            ResourcePath.get_resource_library_base_path('resource-image', 'tenant-test', 'image-library'),
            '/tenant/tenant-test/resource-image-library/image-library'
        )

    def resource_library_path(self):
        self.assertEqual(
            ResourcePath.get_resource_library_path('resource-image', 'tenant-test', 'image-name', 'image-library'),
            '/tenant/tenant-test/resource-image-library/image-library/resource-image/image-name'
        )
        self.assertEqual(
            ResourcePath.get_resource_library_path('resource-image', 'tenant-test', 'image-name'),
            '/tenant/tenant-test/resource-image-library/tenant-test/resource-image/image-name'
        )
