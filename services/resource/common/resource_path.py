from typing import Optional
from urllib.parse import quote

from common.path import path_join


class ResourcePath:
    @staticmethod
    def get_resource_library_base_path(resource_type: str, tenant: str, library: Optional[str] = None) -> str:
        return f'/tenant/{tenant}/{resource_type}-library/{library if library else tenant}'

    @staticmethod
    def get_resource_library_path(resource_type: str, tenant: str, name: str, library: Optional[str] = None) -> str:
        return f'/tenant/{tenant}/{resource_type}-library/{library if library else tenant}/{resource_type}/{name}'

    @staticmethod
    def get_base_dir(resource_type: str, tenant: str, library: str, name: str) -> str:
        return f'{resource_type}/customers/{tenant}/{library}/{quote(name, "")}'

    @staticmethod
    def get_version_dir(
            resource_type: str, tenant: str, library: str, name: str, version: int | str
    ) -> str:
        return f'{ResourcePath.get_base_dir(resource_type, tenant, library, name)}/{version}'

    @staticmethod
    def get_raw_file_path(version: int | None) -> str:
        if not version:
            return 'raw'
        return path_join(version, 'raw')

    @staticmethod
    def get_file_path(
            version: int | None, file_name: str
    ) -> str:
        if not version:
            return file_name
        return path_join(version, file_name)

    @staticmethod
    def get_progress_image_path() -> str:
        return 'progress.webp'
