import unittest

from api.icon.icon_repository import IconRepository
from common.path import path_join
from common.resource_state import ResourceState
from tests.test_utils import (TEST_ROOT, any_library, any_name, any_tenant,
                              get_storage)


class TestIconRepository(unittest.TestCase):
    def setUp(self):
        self.storage = get_storage()
        self.repo = IconRepository(self.storage)

    @staticmethod
    def _get_buffer():
        with open(path_join(TEST_ROOT, 'fixtures', 'sample_color.jpg'), 'rb') as f:
            return f.read()

    ### SAVE ###
    def test_save(self):
        self.storage.delete_folder('icon')
        path = f'icon/hopara/{any_library}/original/{any_name}'
        self.assertFalse(self.storage.file_exists(path))
        self.repo.save(
            any_tenant, any_library, any_name, self._get_buffer()
        )
        self.assertTrue(self.storage.file_exists(path))

    def test_save_when_library_is_none(self):
        self.storage.delete_folder('icon')
        path = f'icon/customers/{any_tenant}/original/{any_name}'
        self.assertFalse(self.storage.file_exists(path))
        self.repo.save(any_tenant, None, any_name, self._get_buffer())
        self.assertTrue(self.storage.file_exists(path))

    def test_save_when_library_is_equal_tenant(self):
        self.storage.delete_folder('icon')
        path = f'icon/customers/{any_tenant}/original/{any_name}'
        self.assertFalse(self.storage.file_exists(path))
        self.repo.save(any_tenant, any_tenant, any_name, self._get_buffer())
        self.assertTrue(self.storage.file_exists(path))

    def test_save_with_slashes(self):
        self.storage.delete_folder('icon')
        path = f'icon/hopara/{any_library}/original/name_with_%2F_slashes'
        self.assertFalse(self.storage.file_exists(path))
        self.repo.save(
            any_tenant, any_library, 'name_with_/_slashes', self._get_buffer()
        )
        self.assertTrue(self.storage.file_exists(path))

    ### END SAVE ###

    ### GET ###

    def test_get_from_hopara_library(self):
        self.storage.delete_folder('icon')
        self.storage.upload(self._get_buffer(), f'icon/hopara/{any_library}/processed/{any_name}.webp')
        res = self.repo.get(any_tenant, any_library, any_name)
        self.assertEqual(ResourceState.SUCCESS, res.state)
        self.assertIsNotNone(self._get_buffer())

    def test_get_from_customer_library(self):
        self.storage.delete_folder('icon')
        self.storage.upload(self._get_buffer(), f'icon/customers/{any_tenant}/processed/{any_name}.webp')
        res = self.repo.get(any_tenant, None, any_name)
        self.assertEqual(ResourceState.SUCCESS, res.state)
        self.assertEqual(self._get_buffer(), res.buffer)

    def test_get_with_slashes(self):
        self.storage.delete_folder('icon')
        self.storage.upload(self._get_buffer(), f'icon/customers/{any_tenant}/processed/name_with_%2F_slashes.webp')
        res = self.repo.get(any_tenant, None, 'name_with_/_slashes')
        self.assertEqual(ResourceState.SUCCESS, res.state)
        self.assertEqual(self._get_buffer(), res.buffer)

    ### END GET ###

    ### DELETE ###

    def test_delete(self):
        # Setup files to delete
        processed_path = f'icon/hopara/{any_library}/processed/{any_name}.webp'
        original_path = f'icon/hopara/{any_library}/original/{any_name}'

        self.storage.upload(self._get_buffer(), processed_path)
        self.storage.upload(self._get_buffer(), original_path)

        self.assertTrue(self.storage.file_exists(processed_path))
        self.assertTrue(self.storage.file_exists(original_path))

        # Delete icon
        result = self.repo.delete(any_tenant, any_library, any_name)

        # Verify deletion
        self.assertEqual(ResourceState.SUCCESS, result)
        self.assertFalse(self.storage.file_exists(processed_path))
        self.assertFalse(self.storage.file_exists(original_path))

    def test_delete_with_slashes(self):
        self.storage.delete_folder('icon')
        path = f'icon/customers/{any_tenant}/processed/name_with_%2F_slashes.webp'
        self.storage.upload(self._get_buffer(), path)
        state = self.repo.delete(any_tenant, None, 'name_with_/_slashes')
        self.assertEqual(ResourceState.SUCCESS, state)
        self.assertFalse(self.storage.file_exists(path))

    ### END DELETE ###

    ### LIST ###

    def test_list(self):
        self.storage.delete_folder('icon')

        # Upload test icons
        icon1_path = f'icon/hopara/{any_library}/processed/icon1'
        icon2_path = f'icon/hopara/{any_library}/processed/icon2'

        self.storage.upload(self._get_buffer(), icon1_path)
        self.storage.upload(self._get_buffer(), icon2_path)

        # Test list
        icons, next_token = self.repo.list(any_tenant, any_library, limit=10)

        # Verify results
        self.assertEqual(2, len(icons))
        icon_names = [icon['name'] for icon in icons]
        self.assertIn('icon1', icon_names)
        self.assertIn('icon2', icon_names)
        self.assertIsNone(next_token)

    def test_list_with_limit_and_next_token(self):
        self.storage.delete_folder('icon')

        # Upload test icons
        for i in range(15):
            icon_path = f'icon/hopara/{any_library}/processed/icon'
            self.storage.upload(self._get_buffer(), f'{icon_path}_{i}')

        # Test list with limit
        icons, next_token = self.repo.list(any_tenant, any_library, limit=10)

        # Verify results
        self.assertEqual(10, len(icons))
        self.assertIsNotNone(next_token)

        icons, next_token = self.repo.list(any_tenant, any_library, page_token=next_token, limit=10)
        self.assertEqual(5, len(icons))
        self.assertIsNone(next_token)

    def test_search_with_query(self):
        self.storage.delete_folder('icon')
        for i in range(5):
            icon_path = f'icon/hopara/{any_library}/processed/icon_{i}'
            self.storage.upload(self._get_buffer(), icon_path)
        icons, next_page_token = self.repo.list(any_tenant, any_library, query='icon_1')
        self.assertEqual('icon_1', icons[0]['name'])
        self.assertIsNone(next_page_token)
        self.assertEqual(1, len(icons))

    def test_search_with_slashed_query(self):
        self.storage.delete_folder('icon')
        icon_path = f'icon/hopara/{any_library}/processed/name_with_%2F_slashes'
        self.storage.upload(self._get_buffer(), icon_path)
        icons, next_page_token = self.repo.list(any_tenant, any_library, query='name_with_/_slashes')
        self.assertEqual('name_with_/_slashes', icons[0]['name'])
        self.assertIsNone(next_page_token)
        self.assertEqual(1, len(icons))

    ### END LIST ###
