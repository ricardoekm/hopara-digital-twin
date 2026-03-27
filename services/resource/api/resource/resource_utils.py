from datetime import datetime
from typing import List

from common.client.s3_storage import S3Storage


def generate_version_name():
    return str(int(datetime.now().timestamp()))


def get_processed_base_dir(resource_type: str, tenant: str, library: str, name: str) -> str:
    return f'{resource_type}/customers/{tenant}/{library}/{name}'


def get_versions(storage: S3Storage, path: str) -> List[str]:
    folders = storage.enum_folders(path)
    folders = [folder.replace(path, '').strip('/') for folder in folders]
    versions = [folder for folder in folders if isinstance(folder, str) and folder.isdigit()]
    return sorted(versions, reverse=True)




def cleanup_metadata(metadata):
    return {key: value for key, value in metadata.items() if value is not None}
