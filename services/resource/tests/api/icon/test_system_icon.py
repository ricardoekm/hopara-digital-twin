import io
import os
import unittest
from unittest.mock import patch

from dependency_injector.wiring import Provide, inject

from api.app import create_app
from api.container import Container
from api.icon.icon_repository import IconRepository
from common.client.storage import Storage
from common.path import path_join
from consumer.app import consumer
from consumer.app import create_app as create_consumer_app
from tests.test_utils import (TEST_ROOT, any_library, any_name, any_tenant,
                              get_authorization_header, get_random_name,
                              upload)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

consumer_app = create_consumer_app()
test_consumer_app = consumer_app.test_client()


def mock_put(*args, **kwargs):
    obj_self, *args = args
    return test_consumer_app.put(*args, **kwargs)


def create_original_file_path(tenant, name, filename):
    return f'icon/customers/{tenant}/{name}/{filename}'


def get_processed_file_path(tenant, name):
    return f'icon/customers/{tenant}/processed/{name}.webp'


def get_model_original_file_path(tenant, name, filename):
    return f'model/customers/{tenant}/{name}/{filename}'


def get_model_processed_file_path(tenant, name):
    return f'model/customers/{tenant}/{name}.glb'


class IconSystemTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.host = f'http://127.0.0.1:2022/tenant/{any_tenant}'
        cls.file_path = path_join(TEST_ROOT, 'fixtures/sample_icon.png')

        cls.patcher = patch('api.icon.search.search_engine.SearchEngine')
        cls.smart_search_mock = cls.patcher.start()
        cls.smart_search_mock.return_value.search.return_value = 'none'
        cls.smart_search_mock.return_value.embedding_search.return_value = []

        cls.app = create_app()
        cls.app.container.wire(modules=[__name__])
        cls.test_app = cls.app.test_client()

    @classmethod
    @inject
    def tearDownClass(cls, storage: Storage = Provide[Container.storage]):
        consumer.stop_listening()
        if hasattr(cls, 'app'):
            cls.app.container.unwire()
        if hasattr(cls, 'patcher'):
            cls.patcher.stop()

    def get_file_data(self):
        return {'file': (open(self.file_path, 'rb'), 'sample.webp')}

    @patch('requests.Session.put', new=mock_put)
    @inject
    def test_save_icon(self, storage: Storage = Provide[Container.storage]):
        #  setup
        name = get_random_name()
        filename = 'sample.webp'
        original_path = create_original_file_path(any_tenant, name, filename)
        processed_path = get_processed_file_path(any_tenant, name)

        storage.delete(original_path)
        storage.delete(processed_path)

        # exercise
        response = self.test_app.put(
            f'{self.host}/icon-library/{any_tenant}/icon/{name}',
            data=self.get_file_data(),
            headers=get_authorization_header()
        )

        # verify
        self.assertEqual(response.status_code, 200)
        self.assertGreater(len(storage.get(original_path)), 0)
        self.assertGreater(len(storage.get(processed_path)), 0)

    @inject
    def test_find_icon(self, storage: Storage = Provide[Container.storage]):
        random_name = get_random_name()
        upload(storage, self.file_path, get_processed_file_path(any_tenant, random_name))

        # exercise
        response = self.test_app.get(f'{self.host}/icon/{random_name}')

        # verify
        self.assertEqual(response.status_code, 200, random_name)
        self.assertEqual('image/png', response.headers.get('Content-Type'))
        self.assertEqual(any_tenant, response.headers.get('Resource-Library'))
        self.assertEqual(random_name, response.headers.get('Resource-Name'))
        self.assertEqual('attachment filename="' + random_name + '"', response.headers.get('Content-Disposition'))
        self.assertGreater(int(response.headers.get('Content-Length')), 0)

    @inject
    def test_delete_icon(self, storage: Storage = Provide[Container.storage]):
        random_name = get_random_name()

        upload(storage, self.file_path, get_processed_file_path(any_tenant, random_name))

        # exercise
        response = self.test_app.delete(
            f'{self.host}/icon-library/{any_tenant}/icon/{random_name}',
            headers=get_authorization_header()
        )

        # verify
        self.assertEqual(200, response.status_code, response.json)
        resource, meta = storage.get(get_processed_file_path(any_tenant, random_name))
        self.assertIsNone(resource)
        self.assertEqual(None, meta)

    @inject
    def test_list_library(self, storage: Storage = Provide[Container.storage]):
        random_name = get_random_name()

        upload(storage, self.file_path, f'icon/hopara/general/{random_name}.webp')
        upload(storage, self.file_path, f'icon/hopara/lab/{random_name}.webp')
        upload(storage, self.file_path, f'icon/hopara/tech/{random_name}.webp')

        # exercise
        response = self.test_app.get(f'{self.host}/icon-library')

        # verify
        self.assertEqual(response.status_code, 200)
        libraries = response.json
        self.assertEqual({'editable': False, 'name': 'general', 'tenant': any_tenant}, libraries[0])
        self.assertEqual({'editable': True, 'name': any_tenant, 'tenant': any_tenant}, libraries[-1])

    @inject
    def test_get_library(self, storage: Storage = Provide[Container.storage]):
        random_name = get_random_name()

        upload(storage, self.file_path, f'icon/hopara/general/{random_name}.webp')

        response = self.test_app.get(f'{self.host}/icon-library/general')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['name'], 'general')
        self.assertEqual(response.json['editable'], False)

        response = self.test_app.get(f'{self.host}/icon-library/{any_tenant}')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json['name'], any_tenant)
        self.assertEqual(response.json['editable'], True)

    @inject
    def test_list_library_icons(self, storage: Storage = Provide[Container.storage]):
        # setup
        base_url = f'{self.host}/icon-library/library-to-test-list/icon'
        for i in range(20):
            upload(storage, self.file_path, f'icon/hopara/library-to-test-list/processed/file-{i}')

        # exercise
        page1 = self.test_app.get(f'{base_url}?&limit=10')
        page_token = page1.headers.get('next-page-token')
        page2 = self.test_app.get(f'{base_url}?&limit=10&page_token={page_token}')

        # verify
        self.assertEqual(page1.status_code, 200)
        items = page1.json
        self.assertEqual(len(items), 10)
        self.assertNotEqual(items[0], items[1])

        self.assertEqual(page2.status_code, 200)
        items = page2.json
        self.assertEqual(len(items), 10)
        self.assertNotEqual(items[0], items[1])
        self.assertIsNone(page2.headers.get('next-page-token'))

    @inject
    def test_list_library_icons_query(self, storage: Storage = Provide[Container.storage]):
        # setup
        storage.delete_folder('icon')
        upload(storage, self.file_path, 'icon/hopara/test-library/processed/abacate')
        upload(storage, self.file_path, 'icon/hopara/test-library/processed/broto')
        upload(storage, self.file_path, 'icon/hopara/test-library/processed/banana')
        upload(storage, self.file_path, 'icon/hopara/test-library/processed/damasco')

        base_url = f'{self.host}/icon-library/test-library/icon'
        # exercise
        response = self.test_app.get(f'{base_url}?&query=A')
        # verify
        self.assertEqual(response.status_code, 200)
        items = response.json
        self.assertEqual(3, len(items))
        self.assertListEqual([
            {'name': 'abacate'},
            {'name': 'banana'},
            {'name': 'damasco'},
        ], items)

        # WITH LIMIT=2
        # exercise
        page1 = self.test_app.get(f'{base_url}?&query=A&limit=2')
        # verify
        self.assertEqual(page1.status_code, 200)
        items = page1.json
        self.assertEqual(2, len(items))
        self.assertListEqual([{'name': 'abacate'}, {'name': 'banana'}], items)

    @inject
    def test_find_icon_with_fallback(self, storage: Storage = Provide[Container.storage]):
        name = 'das989ufdng40td'  # Invalid name to get none on smart search and fallback returns
        upload(storage, self.file_path, f'icon/hopara/general/processed/{name}.webp')

        response = self.test_app.get(f'{self.host}/icon/any_missing')
        self.assertEqual(404, response.status_code)

        response = self.test_app.get(f'{self.host}/icon/any_missing?fallback={name}')
        self.assertEqual(200, response.status_code)

        response = self.test_app.get(f'{self.host}/icon/any_missing?fallback=other_missing')
        self.assertEqual(404, response.status_code)

    @patch('requests.Session.put')
    def test_post_invalid_icon(self, requests_put):
        mock_put = requests_put.return_value
        mock_put.status_code = 400

        response = self.test_app.put(
            f'{self.host}/icon-library/{any_tenant}/icon/test-icon',
            data={'file': (io.BytesIO(b'invalid-icon'), 'invalid-image.png')},
            headers=get_authorization_header()
        )
        self.assertEqual(400, response.status_code)
        self.assertEqual('Invalid image type: text/plain', response.json['message'])

    @inject
    def test_kebabed_name_can_be_find_with_diff_case_styles(self, storage: Storage = Provide[Container.storage]):
        upload(storage, self.file_path, get_processed_file_path(any_tenant, 'test-find'))
        self.assertEqual(self.test_app.get(f'{self.host}/icon/test-find').status_code, 200)
        self.assertEqual(self.test_app.get(f'{self.host}/icon/Test Find').status_code, 200)
        self.assertEqual(self.test_app.get(f'{self.host}/icon/Test%20Find').status_code, 200)
        self.assertEqual(self.test_app.get(f'{self.host}/icon/TEST_FIND').status_code, 200)

    @inject
    def test_free_style_name_can_be_find_only_with_same_name(self, storage: Storage = Provide[Container.storage]):
        upload(storage, self.file_path, get_processed_file_path(any_tenant, 'Test%20Find%202'))
        self.assertEqual(self.test_app.get(f'{self.host}/icon/Test Find 2').status_code, 200)
        self.assertEqual(self.test_app.get(f'{self.host}/icon/Test%20Find%202').status_code, 200)
        # TODO: look original name to improve the test
        # self.assertEqual(self.test_app.get(f'{self.host}/icon/test-find-2').status_code, 404)
        # self.assertEqual(self.test_app.get(f'{self.host}/icon/TEST_FIND_2').status_code, 404)

    @inject
    def test_name_with_slash_should_work(self, storage: Storage = Provide[Container.storage]):
        upload(storage, self.file_path, get_processed_file_path(any_tenant, 'Test%5CFind'))
        self.assertEqual(self.test_app.get(f'{self.host}/icon/Test\\Find').status_code, 200)

        upload(storage, self.file_path, get_processed_file_path(any_tenant, 'Test%2FFind'))
        self.assertEqual(self.test_app.get(f'{self.host}/icon/Test/Find').status_code, 200)

    @inject
    def test_save(self, storage: Storage = Provide[Container.storage]):
        storage.delete_folder('icon')
        resource_repository = IconRepository(storage)
        path = f'icon/hopara/{any_library}/original/{any_name}'
        self.assertFalse(storage.file_exists(path))
        resource_repository.save(
            any_tenant, any_library, any_name, b'sample data'
        )
        self.assertTrue(storage.file_exists(path))
