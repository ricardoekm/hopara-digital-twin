import unittest

from api.icon.Icon_path import IconPath
from tests.test_utils import any_library, any_tenant


class TestIconPath(unittest.TestCase):
    def test_get_original_file_path(self):
        path = IconPath.get_original_filepath(
            any_tenant, any_library, 'name',
        )
        self.assertEqual(
            f'icon/hopara/{any_library}/original/name',
            path
        )

    def test_get_original_with_space(self):
        path = IconPath.get_original_filepath(
            any_tenant, any_library, 'with space'
        )
        self.assertEqual(
            path,
            f'icon/hopara/{any_library}/original/with%20space'
        )

    def test_get_original_with_special_characters(self):
        path = IconPath.get_original_filepath(
            any_tenant, any_library, 'Têst'
        )
        self.assertEqual(
            path,
            f'icon/hopara/{any_library}/original/T%C3%AAst'
        )

    def test_get_original_with_slashes(self):
        path = IconPath.get_original_filepath(
            any_tenant, any_library, 'Test/\\'
        )
        self.assertEqual(
            path,
            f'icon/hopara/{any_library}/original/Test%2F%5C'
        )
