from hashlib import new
import unittest
from unittest.mock import MagicMock, call, patch
from urllib.parse import quote

from api.icon.icon_service import IconService
from api.resource.library import Library
from common.path import path_join
from api.icon.search.fixed_tenant_context_repository import FixedTenantContextRepository
from tests.test_utils import (TEST_ROOT, BufferSizeValidator, any_library,
                              any_query, any_tenant)


class TestIconService(unittest.TestCase):
    @staticmethod
    def get_buffer():
        file_path = path_join(TEST_ROOT, 'fixtures/sample.svg')
        with open(file_path, 'rb+') as fp:
            return fp.read()

    ### LIST ALL ##

    @patch('api.icon.search.search_engine.SearchEngine')
    def test_list_all(self, search_mock):
        mock = search_mock.return_value
        mock.embedding_search.return_value = []
        mock.search.return_value = 'none'

        library1_icons = [
            {"name": "icon3"},
            {"name": "icon2"},
        ]

        tenant_icons = [
            {"name": "icon2"},
            {"name": "icon1"},
            {"name": "any_query-blau"},
        ]

        library2_icons = [
            {"name": "icon4"},
            {"name": "icon5"},
        ]

        library_repository = MagicMock()
        library_repository.list.return_value = [
            Library(any_tenant, "any_library1"),
            Library(any_tenant, "any_library2"),
        ]

        resource_repository = MagicMock()
        resource_repository.list.side_effect = [
            (tenant_icons, None),
            (library1_icons, None),
            (library2_icons, None),
        ]

        service = IconService(resource_repository, library_repository, MagicMock(), MagicMock(), search_mock, FixedTenantContextRepository())
        icons = service.list_all(any_tenant, any_query, 10)
        self.assertEqual(6, len(icons))
        self.assertListEqual(["any_query-blau", "icon1", "icon2", "icon3", "icon4", "icon5"],
                             [i["name"] for i in icons])

        resource_repository.list.assert_has_calls([
            call(any_tenant, any_tenant, query=any_query),
            call(any_tenant, "any_library1", limit=7, query=any_query),
            call(any_tenant, "any_library2", limit=6, query=any_query),
        ])

    ### END LIST ALL ##

    ### LIST FROM LIBRARY ##

    @patch('api.icon.search.search_engine.SearchEngine')
    def test_list_from_library(self, search_mock):
        mock = search_mock.return_value
        mock.embedding_search.return_value = []
        mock.search.return_value = 'none'

        library = any_library
        page_token = None
        limit = 10
        query = any_query

        mock_items = [
            {"name": "icon1"},
            {"name": "icon2"},
            {"name": "icon3"},
        ]

        repository_mock = MagicMock()
        repository_mock.list.return_value = (mock_items, None)

        search_mock = MagicMock()
        search_mock.embedding_search.return_value = []

        service = IconService(repository_mock, MagicMock(), MagicMock(), MagicMock(), search_mock, FixedTenantContextRepository())
        items, next_page_token = service.list_from_library(any_tenant, library, page_token, limit, query)

        self.assertEqual(mock_items, items)
        self.assertIsNone(next_page_token)
        repository_mock.list.assert_called_once_with(any_tenant, library, page_token, limit, query.lower())

    ### END LIST FROM LIBRARY ##

    ### LIST LIBRARIES ##
    @patch('api.icon.search.search_engine.SearchEngine')
    def test_list_libraries(self, search_mock):
        mock = search_mock.return_value
        mock.embedding_search.return_value = []
        mock.search.return_value = 'none'

        library1 = Library(any_tenant, "library1")
        library2 = Library(any_tenant, "library2")

        library_repository_mock = MagicMock()
        library_repository_mock.list.return_value = [library1, library2]

        service = IconService(MagicMock(), library_repository_mock, MagicMock(), MagicMock(), search_mock, FixedTenantContextRepository())
        libraries = service.list_libraries(any_tenant)

        self.assertEqual(2, len(libraries))
        self.assertIn(library1, libraries)
        self.assertIn(library2, libraries)
        library_repository_mock.list.assert_called_once_with(any_tenant)

    ### END LIST LIBRARIES ##

    ### GET LIBRARY ##
    @patch('api.icon.search.search_engine.SearchEngine')
    def test_get_library(self, search_mock):
        mock = search_mock.return_value
        mock.embedding_search.return_value = []
        mock.search.return_value = 'none'

        library_name = "test_library"
        library = Library(any_tenant, library_name)

        library_repository_mock = MagicMock()
        library_repository_mock.get.return_value = library

        service = IconService(MagicMock(), library_repository_mock, MagicMock(), MagicMock(), search_mock, FixedTenantContextRepository())
        result = service.get_library(any_tenant, library_name)

        self.assertEqual(library, result)
        library_repository_mock.get.assert_called_once_with(any_tenant, library_name)

    @patch('api.icon.search.search_engine.SearchEngine')
    def test_preserve_icon_original_name(self, search_mock):
        mock = search_mock.return_value
        mock.embedding_search.return_value = []
        mock.search.return_value = 'none'
        name = 'test'
        storage = MagicMock()
        storage.get.return_value = (b"test", {})
        process_client = MagicMock()
        process_client.process_icon.return_value = True
        repository_mock = MagicMock()
        library_repository_mock = MagicMock()
        service = IconService(
            repository_mock,
            library_repository_mock,
            process_client,
            MagicMock(),
            search_mock,
            FixedTenantContextRepository()
        )
        buffer = self.get_buffer()
        service.save(any_tenant, None, name, buffer)

        repository_mock.save.assert_called_once_with(
            any_tenant, None, name, BufferSizeValidator(802),
        )
        escaped_name = quote(name, "")
        process_client.process_sync.assert_called_once_with({
            'cwd': f'icon/customers/{any_tenant}',
            'type': 'icon_resize',
            'data': {
                'origin': f'original/{escaped_name}',
                'destination': f'processed/{escaped_name}.webp'
            },
            'invalidation_urls': [f'/tenant/{any_tenant}/icon*'],
            'ready': True,
        })
