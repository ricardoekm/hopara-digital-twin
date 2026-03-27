import io
import os
import time
import unittest
from unittest.mock import patch

from dependency_injector.wiring import Provide, inject

from api.app import create_app
from api.container import Container
from api.model.model_path import ModelPath
from common.client.storage import Storage
from common.path import path_join
from consumer.app import consumer
from consumer.app import create_app as create_consumer_app
from tests.test_utils import (TEST_ROOT, any_library, any_tenant,
                              get_authorization_header, get_random_name,
                              upload)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

consumer_app = create_consumer_app()
test_consumer_app = consumer_app.test_client()


def get_template_path(name, tenant):
    return f'model/customers/{tenant}/{name}/model.glb'


def mock_put(*args, **kwargs):
    obj_self, *args = args
    return test_consumer_app.put(*args, **kwargs)


class TestSystemModel(unittest.TestCase):
    @classmethod
    def setUp(cls):
        cls.host = f'http://127.0.0.1:2022/tenant/{any_tenant}'
        cls.file_path = path_join(TEST_ROOT, 'fixtures/sample.glb')
        cls.png_file_path = path_join(TEST_ROOT, 'fixtures/sample.png')
        cls.app = create_app()
        cls.app.container.wire(modules=[__name__])
        cls.test_app = cls.app.test_client()

    @classmethod
    def tearDownClass(cls):
        consumer.stop_listening()
        cls.app.container.unwire()

    def get_file_data(self):
        return {'file': (open(self.file_path, 'rb'), 'sample.glb')}

    @patch('requests.Session.put', new=mock_put)
    @inject
    def test_save(self, storage: Storage = Provide[Container.storage]):
        #  setup
        name = get_random_name()
        cwd = ModelPath.get_base_dir(any_tenant, 'default', name)

        # exercise
        response = self.test_app.put(
            f'{self.host}/model/{name}?compressed-gltf=false',
            data=self.get_file_data(),
            headers=get_authorization_header()
        )
        version = response.json['version']
        original_path = ModelPath.get_raw_file_path(version)
        processed_path = ModelPath.get_processed_file_path(version)

        # verify
        self.assertEqual(response.status_code, 200)
        original_bytes = storage.get_bytes(original_path, cwd)
        processed_bytes = storage.get_bytes(processed_path, cwd)
        self.assertGreater(len(original_bytes), 0)
        self.assertGreater(len(processed_bytes), 0)

    @inject
    def test_find(self, storage: Storage = Provide[Container.storage]):
        cwd = ModelPath.get_base_dir(any_tenant, any_library, 'test-find')
        # setup
        upload_path = ModelPath.get_processed_file_path(123456789)
        upload(storage, self.file_path, upload_path, {'mimetype': 'model/gltf-binary'}, cwd=cwd)

        # exercise
        response = self.test_app.get(f'{self.host}/model-library/{any_library}/model/test-find')

        # verify
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.headers.get('Content-Type'), 'model/gltf-binary')
        self.assertEqual(response.headers.get('Resource-Name'), 'test-find')
        self.assertEqual(response.headers.get('Resource-Library'), any_library)
        self.assertEqual(response.headers.get('Content-Disposition'), 'attachment')
        self.assertGreater(int(response.headers.get('Content-Length')), 0)

    @inject
    def test_find_screenshot(self, storage: Storage = Provide[Container.storage]):
        cwd = ModelPath.get_base_dir(any_tenant, any_library, 'test-find')
        # setup
        upload(
            storage,
            self.png_file_path,
            ModelPath.get_processed_image_file_path(123456789),
            cwd=cwd
        )

        # exercise
        response = self.test_app.get(f'{self.host}/model-library/{any_library}/model/test-find',
                                     headers={'Accept': 'image/png'})

        # verify
        self.assertEqual(response.status_code, 200)
        self.assertEqual('image/png', response.headers.get('Content-Type'))
        self.assertEqual(response.headers.get('Resource-Library'), any_library)
        self.assertEqual(response.headers.get('Resource-Name'), 'test-find')
        self.assertEqual(response.headers.get('Content-Disposition'), 'attachment')
        self.assertGreater(int(response.headers.get('Content-Length')), 0)

    @inject
    def test_find_metadata(self, storage: Storage = Provide[Container.storage]):
        # setup
        upload(storage, self.file_path,
               get_template_path('test-find-meta', any_tenant),
               {"mimetype": "model/gltf-binary"})

        # exercise
        response = self.test_app.get(f'{self.host}/model-library/{any_library}/model/test-find-meta',
                                     headers={'accept': 'application/json'})

        # verify
        self.assertEqual(200, response.status_code)
        self.assertEqual('application/json', response.headers.get('Content-Type'))
        self.assertDictEqual({'dimensions': {'height': 0, 'width': 0}, 'mimetype': 'model/gltf-binary'}, response.json)

    @inject
    def test_find_with_fallback(self, storage: Storage = Provide[Container.storage]):
        cwd = ModelPath.get_base_dir(any_tenant, any_library, 'fallback')
        upload_path = ModelPath.get_processed_file_path(123456789)
        upload(storage, self.file_path, upload_path, cwd=cwd)

        response = self.test_app.get(f'{self.host}/model-library/{any_library}/model/any_missing')
        self.assertEqual(404, response.status_code)

        response = self.test_app.get(f'{self.host}/model-library/{any_library}/model/any_missing?fallback=fallback')
        self.assertEqual(200, response.status_code)

        response = self.test_app.get(
            f'{self.host}/model-library/{any_library}/model/any_missing?fallback=other_missing')
        self.assertEqual(404, response.status_code)

    def test_post_empty_model(self):
        response = self.test_app.put(
            f'{self.host}/model-library/{any_library}/model/empty_missing',
            data={'file': (io.BytesIO(b''), 'invalid-image.png')},
            headers=get_authorization_header()
        )
        self.assertEqual(response.status_code, 400)
        self.assertTrue('Original resource buffer is empty' in response.json['message'])

    @inject
    def test_not_found_event_if_fallback_to_hopara_libraries(self):
        response = self.test_app.get(f'{self.host}/model-library/inexistent-library/model/not-found')

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json, {
            'message': 'resource not found!',
        })

    @inject
    def test_fallback_to_hopara_libraries_screenshot(self, storage: Storage = Provide[Container.storage]):
        upload(
            storage, self.file_path, 'model/hopara/any-hopara-library/any/model.glb',
        )
        upload(
            storage, self.png_file_path, 'model/hopara/any-hopara-library/any/render.webp',
        )
        response = self.test_app.get(f'{self.host}/model-library/inexistent-library/model/any?format=image')

        self.assertEqual(200, response.status_code)
        self.assertEqual(response.headers.get('Content-Type'), 'image/png')
        self.assertEqual(response.headers.get('Resource-Name'), 'any')
        self.assertEqual(response.headers.get('Content-Disposition'), 'attachment')
        self.assertGreater(int(response.headers.get('Content-Length')), 0)

    @patch('requests.Session.put', new=mock_put)
    @inject
    def test_history(self, storage: Storage = Provide[Container.storage]):
        name = get_random_name()
        for i in range(3):
            cwd = ModelPath.get_base_dir(any_tenant, any_library, name)
            upload(
                storage,
                self.file_path,
                ModelPath.get_processed_file_path(i + 1),
                cwd=cwd
            )
            upload(
                storage,
                self.file_path,
                ModelPath.get_raw_file_path(i + 1),
                cwd=cwd
            )

        # enumerate versions
        url = f'{self.host}/model-library/{any_library}/model/{name}'
        response = self.test_app.get(f'{url}/history')
        self.assertEqual(200, response.status_code)
        versions = [item['version'] for item in response.json]
        self.assertEqual(4, len(versions))
        latest, middle, oldest, no_image_version = versions
        self.assertGreater(latest, middle, versions)
        self.assertGreater(middle, oldest, versions)
        self.assertGreater(oldest, no_image_version, versions)

        # get current version
        response = self.test_app.get(url)
        self.assertEqual(200, response.status_code, response.json)

        # rollback version
        rollback_response = self.test_app.put(f'{url}/history/{middle}/rollback', headers=get_authorization_header())
        self.assertEqual(200, rollback_response.status_code, response.json)
        get_response = self.test_app.get(url)
        self.assertEqual(200, get_response.status_code)
        rollback_version = int(rollback_response.json.get('version'))
        self.assertTrue(rollback_version > latest, f'{rollback_version=} {versions=}')

        time.sleep(1)
        # restore version
        restore_response = self.test_app.put(f'{url}/history/{middle}/restore', headers=get_authorization_header())
        self.assertEqual(200, restore_response.status_code, response.json)
        get_response2 = self.test_app.get(url)
        self.assertEqual(200, get_response2.status_code, get_response2.json)
        restore_version = int(restore_response.json.get('version'))
        self.assertTrue(restore_version > rollback_version,
                        f'{restore_version=} {rollback_version=} {versions=}')
