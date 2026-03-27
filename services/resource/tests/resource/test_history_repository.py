import unittest
from unittest.mock import MagicMock

from api.image.image_path import ImagePath
from api.resource.resource_history_repository import ResourceHistoryRepository
from tests.test_utils import any_library, any_name, any_tenant, get_storage

original_base_path = f'image/customers/{any_tenant}/{any_library}'
processed_base_path = f'image/customers/{any_tenant}/{any_library}'
invalidation_base_path = f'/tenant/{any_tenant}/image-library/{any_library}/image'


class TestResourceHistoryRepository(unittest.TestCase):
    def setUp(self):
        self.storage = get_storage()
        self.repository = ResourceHistoryRepository(self.storage, 'image')
        self.repository.version_factory.create = MagicMock(return_value=12347)

        self.storage.delete_folder(ImagePath.get_base_dir(any_tenant, any_library, any_name))
        self.storage.delete_folder(ImagePath.get_base_dir(any_tenant, any_library, any_name))

        cwd = ImagePath.get_base_dir(any_tenant, any_library, any_name)

        self.storage.upload(b'12345', ImagePath.get_raw_file_path(12345), cwd=cwd)
        self.storage.upload(b'12346', ImagePath.get_raw_file_path(12346), cwd=cwd)
        self.storage.upload(b'12344', ImagePath.get_raw_file_path(12344), cwd=cwd)
        self.storage.upload(b'12345', ImagePath.get_resolution_path(12345, 'md'), cwd=cwd)
        self.storage.upload(b'12346', ImagePath.get_resolution_path(12346, 'md'), cwd=cwd)
        self.storage.upload(b'12344', ImagePath.get_resolution_path(12344, 'md'), cwd=cwd)

    ### LIST ###

    def test_list(self):
        res = self.repository.list(any_tenant, any_library, any_name)
        self.assertEqual(12346, res[0]['version'])
        self.assertEqual(12345, res[1]['version'])
        self.assertEqual(12344, res[2]['version'])
        self.assertEqual(0, res[3]['version'])

    def test_history_list_with_limit(self):
        res = self.repository.list(any_tenant, any_library, any_name, 2)
        self.assertEqual(2, len(res))
        self.assertEqual(12346, res[0]['version'])
        self.assertEqual(12345, res[1]['version'])

    ### END LIST ###

    ### RESTORE ###
    def test_restore(self):
        cwd = ImagePath.get_base_dir(any_tenant, any_library, any_name)

        result = self.repository.restore(any_tenant, any_library, any_name, 12345)
        self.assertEqual(result, 12347)

        content = self.storage.get_bytes(ImagePath.get_raw_file_path(12347), cwd=cwd)
        self.assertEqual(b'12345', content)

        self.assertTrue(
            self.storage.file_exists(ImagePath.get_raw_file_path(12347), cwd=cwd)
        )
        self.assertTrue(self.storage.file_exists(ImagePath.get_resolution_path(12347, 'md'), cwd=cwd))

    def test_restore_to_zero(self):
        cwd = ImagePath.get_base_dir(any_tenant, any_library, any_name)
        result = self.repository.restore(any_tenant, any_library, any_name, 0)
        content = self.storage.get_bytes(
            ImagePath.get_file_path(12347, 'empty'), cwd=cwd
        )
        self.assertEqual(b'empty', content)
        self.assertEqual(result, 0)

    ### END RESTORE ###

    ### UNDO ###
    def test_undo(self):
        result = self.repository.undo(any_tenant, any_library, any_name, 12345)

        cwd = ImagePath.get_base_dir(any_tenant, any_library, any_name)

        content = self.storage.get_bytes(ImagePath.get_raw_file_path(12347), cwd=cwd)
        self.assertEqual(b'12344', content)

        self.assertEqual(result, 12347)
        self.assertTrue(
            self.storage.file_exists(ImagePath.get_raw_file_path(12347), cwd=cwd)
        )
        self.assertTrue(self.storage.file_exists(ImagePath.get_resolution_path(12347, 'md'), cwd=cwd))

    def test_undo_to_zero(self):
        cwd = ImagePath.get_base_dir(any_tenant, any_library, any_name)
        result = self.repository.undo(any_tenant, any_library, any_name, 12344)
        self.assertEqual(result, 0)
        self.assertFalse(
            self.storage.file_exists(ImagePath.get_raw_file_path(12347), cwd=cwd)
        )
        self.assertFalse(self.storage.file_exists(ImagePath.get_resolution_path(12347, 'md'), cwd=cwd))
        self.assertTrue(
            self.storage.file_exists(ImagePath.get_file_path(12347, 'empty'), cwd=cwd)
        )
