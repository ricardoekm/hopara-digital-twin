import os

from common.path import path_join

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def add_slash(path: str) -> str:
    return path if path.endswith('/') else path + '/'


def get_resource_path(tenant: str, resource_type: str, name: str) -> str:
    return f'/tenant/{tenant}/{resource_type}/{name}'


def get_processed_libraries_dir(resource_type: str) -> str:
    return f'{resource_type}/hopara/'


def get_processed_library_dir(resource_type: str, library: str) -> str:
    return add_slash(path_join(get_processed_libraries_dir(resource_type), library))


def get_data_dir() -> str:
    return path_join(BASE_DIR, 'data')


def get_smart_search_dir() -> str:
    return path_join(get_data_dir(), 'smart_search')


def get_resources_dir(resource_type: str) -> str:
    return path_join(BASE_DIR, 'resources', resource_type)
