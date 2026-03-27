from typing import List

from api.paths import get_resource_path
from common.resource_path import ResourcePath

model_type = 'model'
default_ext = 'glb'


class ModelPath:
    @staticmethod
    def get_raw_file_path(version: int|None) -> str:
        return ResourcePath.get_raw_file_path(version)

    @staticmethod
    def get_version_dir(tenant: str, library: str, name: str, version: int) -> str:
        return ResourcePath.get_version_dir(model_type, tenant, library, name, version)

    @staticmethod
    def get_base_dir(tenant: str, library: str, name: str) -> str:
        if not tenant:
            return f'model/hopara/{library}/{name}'
        return ResourcePath.get_base_dir(model_type, tenant, library, name)

    @staticmethod
    def get_processed_file_path(version: int) -> str:
        return ResourcePath.get_file_path(version, 'model.glb')

    @staticmethod
    def get_invalidation_path(tenant: str, library: str | None, name: str) -> List[str]:
        return [
            get_resource_path(tenant, model_type, name) + '*',
            ResourcePath.get_resource_library_path(model_type, tenant, name, library) + '*',
        ]

    @staticmethod
    def get_processed_image_file_path(version: int) -> str:
        return ResourcePath.get_file_path(version, 'render.webp')
