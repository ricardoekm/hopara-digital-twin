import unittest
import uuid

from api.model.model_path import ModelPath
from api.model.model_repository import ModelRepository
from common.resource_result import ResourceResult
from common.resource_state import ResourceState
from tests.test_utils import (any_library, any_name, any_tenant, any_version,
                              get_storage)

original_base_path = f'image/customers/{any_tenant}/{any_library}'
processed_base_path = f'image/customers/{any_tenant}/{any_library}'
invalidation_base_path = f'/tenant/{any_tenant}/image-library/{any_library}/image'


class TestModelRepository(unittest.TestCase):
    def setUp(self):
        self.storage = get_storage()
        self.repository = ModelRepository(self.storage)
        self.storage.delete_folder(ModelPath.get_base_dir(any_tenant, any_library, any_name))
        self.storage.delete_folder(ModelPath.get_base_dir(any_tenant, any_library, any_name))

    ### GET LATEST VERSION ###
    def test_get_latest_version(self):
        cwd = ModelPath.get_base_dir(any_tenant, any_library, any_name)
        self.storage.upload(b'any', ModelPath.get_processed_image_file_path(12345), cwd=cwd)
        self.storage.upload(b'any', ModelPath.get_processed_image_file_path(12346), cwd=cwd)
        self.storage.upload(b'any', ModelPath.get_processed_image_file_path(12344), cwd=cwd)
        latest = self.repository.get_latest_version(any_tenant, any_library, any_name)
        self.assertEqual(latest, 12346)

    ### END GET LATEST VERSION ###

    ### GET ###
    def test_get_not_found(self):
        result = self.repository.get(any_tenant, any_library, 'not_found', any_version, 'model')
        self.assertEqual(result, ResourceResult(ResourceState.NOT_FOUND, None))

    def test_get_processing(self):
        cwd = ModelPath.get_base_dir(any_tenant, any_library, any_name)
        self.storage.upload(
            b'raw', ModelPath.get_raw_file_path(any_version), cwd=cwd
        )
        result = self.repository.get(any_tenant, any_library, any_name, any_version, 'model')
        self.assertEqual(result, ResourceResult.processing())

    def test_get_model(self):
        cwd = ModelPath.get_base_dir(any_tenant, any_library, any_name)
        self.storage.upload(
            b'any_model', ModelPath.get_processed_file_path(any_version), {'width': 2048, 'height': 2048}, cwd=cwd
        )
        result = self.repository.get(any_tenant, any_library, any_name, any_version, 'model')
        self.assertEqual(result.state, ResourceState.SUCCESS)
        self.assertEqual(result.metadata['tenant'], any_tenant)
        self.assertEqual(result.metadata['library'], any_library)
        self.assertEqual(result.metadata['name'], any_name)
        self.assertEqual(result.metadata['version'], any_version)
        self.assertEqual(str(result.metadata['width']), '2048')
        self.assertEqual(str(result.metadata['height']), '2048')
        self.assertEqual(result.buffer, b'any_model')

    def test_get_json(self):
        cwd = ModelPath.get_base_dir(any_tenant, any_library, any_name)
        self.storage.upload(
            b'any_buffer', ModelPath.get_processed_file_path(any_version), {'width': 2048, 'height': 2048}, cwd=cwd
        )
        result = self.repository.get(any_tenant, any_library, any_name, any_version, 'json')
        self.assertEqual(result.state, ResourceState.SUCCESS)
        self.assertEqual(result.metadata['version'], any_version)
        self.assertEqual(str(result.metadata['width']), '2048')
        self.assertEqual(str(result.metadata['height']), '2048')

    def test_get_image(self):
        cwd = ModelPath.get_base_dir(any_tenant, any_library, any_name)
        self.storage.upload(
            b'any_image', ModelPath.get_processed_image_file_path(any_version), {'width': 2048, 'height': 2048},
            cwd=cwd
        )
        result = self.repository.get(any_tenant, any_library, any_name, any_version, 'image')
        self.assertEqual(result.state, ResourceState.SUCCESS)
        self.assertEqual(result.metadata['version'], any_version)
        self.assertEqual(str(result.metadata['width']), '2048')
        self.assertEqual(str(result.metadata['height']), '2048')
        self.assertEqual(result.buffer, b'any_image')

    ### END GET ###

    ### GET FROM TEMPLATE ###

    def test_get_from_template(self):
        any_random_name = uuid.uuid4().hex
        self.storage.upload(b'any_glb', f'model/customers/{any_tenant}/{any_random_name}/model.glb')
        self.storage.upload(b'any_image', f'model/customers/{any_tenant}/{any_random_name}/render.webp')

        result = self.repository.get_from_template(any_tenant, any_random_name, 'model')
        self.assertEqual(result.buffer, b'any_glb')

        result = self.repository.get_from_template(any_tenant, any_random_name, 'image')
        self.assertEqual(result.buffer, b'any_image')

    def test_get_from_hopara_template(self):
        any_random_name = uuid.uuid4().hex
        self.storage.upload(b'any_glb', f'model/hopara/any_library/{any_random_name}/model.glb')
        self.storage.upload(b'any_image', f'model/hopara/any_library/{any_random_name}/render.webp')

        result = self.repository.get_from_template(any_tenant, any_random_name, 'model')
        self.assertEqual(result.buffer, b'any_glb')

        result = self.repository.get_from_template(any_tenant, any_random_name, 'image')
        self.assertEqual(result.buffer, b'any_image')

    ### END GET FROM TEMPLATE ###

    ### SAVE ###
    def test_save_original(self):
        cwd = ModelPath.get_base_dir(any_tenant, any_library, any_name)
        original_path = ModelPath.get_raw_file_path(any_version)
        self.assertFalse(self.storage.file_exists(original_path, cwd=cwd))
        self.repository.save_original(any_tenant, any_library, any_name, any_version, b'test')
        self.assertTrue(self.storage.file_exists(original_path, cwd=cwd))

    ### END SAVE ###
