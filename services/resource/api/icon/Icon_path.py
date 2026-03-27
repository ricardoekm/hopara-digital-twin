from urllib.parse import quote

from common.path import path_join

default_ext = 'webp'


class IconPath:
    @staticmethod
    def get_base_dir(tenant: str, library: str | None) -> str:
        if not library or library == tenant:
            return f'icon/customers/{tenant}'
        return f'icon/hopara/{library}'

    @staticmethod
    def get_original_filepath(tenant: str, library: str | None, name: str) -> str:
        return path_join(IconPath.get_base_dir(tenant, library), f'original/{quote(name, safe="")}')

    @staticmethod
    def get_original_filename(name: str) -> str:
        return f'original/{quote(name, safe="")}'

    @staticmethod
    def get_processed_path(tenant: str, library: str | None) -> str:
        if library is None or library == tenant:
            return f'icon/customers/{tenant}/processed/'
        return f'icon/hopara/{library}/processed/'

    @staticmethod
    def get_processed_filepath(tenant: str, library: str | None, name: str) -> str:
        return IconPath.get_processed_path(tenant, library) + f'{quote(name, safe="")}.{default_ext}'

    @staticmethod
    def get_processed_filename(name: str) -> str:
        return f'processed/{quote(name, safe="")}.{default_ext}'

    @staticmethod
    def get_invalidation_path(tenant: str) -> str:
        return f'/tenant/{tenant}/icon*'
