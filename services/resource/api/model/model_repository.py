import json
import os.path
from typing import Tuple
from urllib.parse import quote

from api.image.image import ModelRequestFormat
from api.model.model_path import ModelPath
from common.client.storage import Storage
from common.path import path_join
from common.resource_result import ResourceResult
from common.version import VersionFactory


class ModelRepository:
    def __init__(self, storage: Storage):
        self.default_ext = 'glb'
        self.storage = storage
        self.version_factory = VersionFactory()

    def _get_template_file_path(self, tenant: str, name: str) -> str | None:
        quoted_name = quote(name, "")
        customer_dir = f'model/customers/{tenant}'
        template_path = f'{customer_dir}/{quoted_name}/model.glb'
        if self.storage.file_exists(template_path):
            return template_path

        general_dir = 'model/hopara/'
        valid_libs = []
        for folder in self.storage.enum_folders(general_dir):
            folder = folder.replace(general_dir, '')
            items = folder.split('/')
            if len(items) > 0 and items[0] not in valid_libs:
                valid_libs.append(items[0])

        for library_path in valid_libs:
            template_path = f'{general_dir}{library_path}/{quoted_name}/model.glb'
            if self.storage.file_exists(template_path):
                return template_path
        return None

    def _read_from_format(
            self, cwd: str, path: str, image_path: str, format: ModelRequestFormat
    ) -> Tuple[bytes | None, dict]:
        if format == 'image':
            res = self.storage.get(image_path, cwd=cwd)
            return res[0], res[1] or {}
        if format == 'model':
            res = self.storage.get(path, cwd=cwd)
            return res[0], res[1] or {}
        metadata = self.storage.get_metadata(path, cwd=cwd)
        if format == 'json':
            return None, metadata
        return json.dumps(metadata).encode(), metadata

    def get_latest_version(self, tenant: str, library: str, name: str) -> int | None:
        path = ModelPath.get_base_dir(tenant, library, name)
        versions = self.storage.get_versions(path)
        if versions:
            return versions[0]  # mais recente
        return None

    def get(
            self, tenant: str, library: str, name: str, version: int, format: ModelRequestFormat
    ) -> ResourceResult:
        cwd = ModelPath.get_base_dir(tenant, library, name)
        image_path = ModelPath.get_processed_image_file_path(version)
        path = ModelPath.get_processed_file_path(version)
        buffer, metadata = self._read_from_format(cwd, path, image_path, format)

        if format == 'json':
            metadata['version'] = version
            return ResourceResult.success(buffer, metadata)

        if buffer is not None:
            metadata['tenant'] = tenant
            metadata['library'] = library
            metadata['name'] = name
            metadata['version'] = version
            return ResourceResult.success(buffer, metadata)

        if self.storage.file_exists(ModelPath.get_raw_file_path(version), cwd):
            return ResourceResult.processing()

        return ResourceResult.not_found()

    def get_from_template(self, tenant: str, name: str, format: ModelRequestFormat) -> ResourceResult:
        template_file_path = self._get_template_file_path(tenant, name)
        if not template_file_path:
            return ResourceResult.not_found()
        template_image_path = path_join(os.path.dirname(template_file_path), 'render.webp')
        buffer, metadata = self._read_from_format('', template_file_path, template_image_path, format)
        if buffer and format != 'json':
            metadata['tenant'] = tenant
            metadata['name'] = name
            metadata['version'] = 0
            return ResourceResult.success(buffer, metadata)
        if metadata and format == 'json':
            return ResourceResult.success(None, metadata)
        return ResourceResult.not_found()

    def save_original(self, tenant: str, library: str, name: str, version: int | None, buffer: bytes) -> None:
        cwd = ModelPath.get_base_dir(tenant, library, name)
        path = ModelPath.get_raw_file_path(version)
        self.storage.upload(buffer, path, cwd=cwd)
