import base64
import concurrent.futures
import io
import json
import logging
import os
import re
from typing import Any, Dict, List, Optional, Tuple
from urllib.parse import quote, unquote

from boto3 import client as boto3_client
from botocore.client import BaseClient
from botocore.config import Config

from common.client.storage import Storage
from common.dictionary import get_bool
from common.path import path_join


def add_slash(path):
    return path if path.endswith('/') else path + '/'


def get_status_code(response):
    return response['ResponseMetadata']['HTTPStatusCode']


class S3Storage(Storage):
    _client: BaseClient

    def __init__(self, bucket: str, endpoint: Optional[str] = None):
        using_localstack = not get_bool(os.environ, 'DISABLE_LOCALSTACK', False)
        logging.info(f'S3 bucket={bucket} | endpoint={endpoint}')
        self._client = boto3_client(
            's3', config=Config(max_pool_connections=30, tcp_keepalive=True),
            endpoint_url=endpoint,
        )
        if using_localstack:
            self._client.create_bucket(Bucket=bucket)
        self.bucket = bucket

    def __del__(self):
        self._client.close()

    def upload(self, buffer: bytes, path: str, metadata: Dict | None = None, cwd: str = '') -> None:
        full_path = path_join(cwd, path)
        extra_args = {'Metadata': {k: quote(str(v), safe="") for k, v in metadata.items()}} if metadata else None
        self._client.upload_fileobj(io.BytesIO(buffer), self.bucket, full_path, ExtraArgs=extra_args)

    def enum_folders(self, path, fast_mode=False):
        if fast_mode:
            # Esse modo pode dar problema com pasta com apenas um item, porém é o melhor para pastas muitos cheias
            objects = self._client.list_objects(Bucket=self.bucket, Prefix=path, Delimiter='/')
            return sorted([obj['Prefix'] for obj in objects.get('CommonPrefixes', [])])

        file_paths, next_page_token = self.enum_files(path, limit=1000)
        while next_page_token:
            current_file_paths, next_page_token = self.enum_files(path, next_page_token, limit=1000)
            file_paths.extend(current_file_paths)
        return list(set([os.path.dirname(file_path) for file_path in file_paths]))

    def get_versions(self, path: str) -> List[int]:
        folders = self.enum_folders(path)
        folders = [folder.replace(path, '').strip('/') for folder in folders]
        versions = [int(folder) for folder in folders if isinstance(folder, str) and folder.isdigit()]
        return sorted(versions, reverse=True)

    def get_latest_version(self, path: str) -> int | None:
        versions = self.get_versions(path)
        if versions:
            return int(versions[0])  # mais recente
        return None

    def enum_files(self, path: str | None, page_token: Optional[str] = None, limit: Optional[int] = 100) -> Tuple[
        list, str | None]:
        prefix = add_slash(path) if path else ''
        params = {'Bucket': self.bucket, 'Prefix': prefix}
        if limit:
            params['MaxKeys'] = limit
        if page_token:
            params['ContinuationToken'] = base64.b64decode(page_token.encode('ascii')).decode('ascii')

        objects = self._client.list_objects_v2(**params)
        next_page_token = objects.get('NextContinuationToken')
        if next_page_token:
            next_page_token = base64.b64encode(
                objects.get('NextContinuationToken').encode('ascii'),
            ).decode('ascii')

        file_paths = []
        for obj in objects.get('Contents', []):
            if obj.get('Size', 0) > 0:
                file_paths.append(obj['Key'])
        return file_paths, next_page_token

    def search_files(self, path: str, query: str, limit: Optional[int] = 100) -> list[str]:
        page_token = None
        matched_paths = []
        for _ in range(0, 10):
            file_paths, next_page_token = self.enum_files(path, page_token, None)
            file_names = [os.path.basename(file_path) for file_path in file_paths]
            matched_paths += [fn for fn in file_names if re.search(query, os.path.splitext(fn)[0], flags=re.IGNORECASE)]
            if limit and len(matched_paths) >= limit:
                return matched_paths[0:limit]
            if not next_page_token or page_token == next_page_token:
                break
            page_token = next_page_token
        return matched_paths

    def delete(self, path: str, cwd: str = '') -> int:
        return get_status_code(self._client.delete_object(Bucket=self.bucket, Key=path_join(cwd, path)))

    def get(self, path: str, cwd: str = '') -> Tuple[bytes | None, dict | None]:
        try:
            obj = self._client.get_object(Bucket=self.bucket, Key=path_join(cwd, path))
            metadata = {k: unquote(v) for k, v in obj.get('Metadata', {}).items()}
            return obj['Body'].read(), metadata
        except self._client.exceptions.NoSuchKey:
            return None, None

    def get_with_info(self, file_info: Tuple[str, str, int, str]) -> Tuple[bytes | None, dict | None, str, str, int]:
        path, name, version, cwd = file_info
        buffer, metadata = self.get(path, cwd)
        return buffer, metadata, path, name, version

    def get_json(self, path: str, cwd: str = '') -> dict:
        try:
            obj = self._client.get_object(Bucket=self.bucket, Key=path_join(cwd, path))
            content = obj['Body'].read().decode('utf-8')
            return json.loads(content)
        except (self._client.exceptions.NoSuchKey, json.JSONDecodeError):
            return {}

    def get_bytes(self, path: str, cwd: str = '') -> bytes | None:
        try:
            obj = self._client.get_object(Bucket=self.bucket, Key=path_join(cwd, path))
            return obj['Body'].read()
        except self._client.exceptions.NoSuchKey:
            return None

    def file_exists(self, path: str, cwd: str = '') -> bool:
        try:
            return 200 <= get_status_code(
                self._client.head_object(Bucket=self.bucket, Key=path_join(cwd, path))) < 300
        except (self._client.exceptions.ClientError, self._client.exceptions.NoSuchKey):
            return False

    def get_metadata(self, path: str, cwd: str = '') -> dict:
        try:
            return {
                k: unquote(v) for k, v in
                self._client.head_object(Bucket=self.bucket, Key=path_join(cwd, path)).get('Metadata', {}).items()
            }
        except Exception:
            pass
        return {}

    def copy(self, source_path: str, destination_path: str, metadata: dict | None = None) -> int:
        if metadata:
            result = self._client.copy_object(
                CopySource=f'{self.bucket}/{source_path}', Bucket=self.bucket,
                Key=destination_path, Metadata=metadata, MetadataDirective='REPLACE',
            )
        else:
            result = self._client.copy_object(
                CopySource=f'{self.bucket}/{source_path}', Bucket=self.bucket,
                Key=destination_path,
            )
        return get_status_code(result)

    def copy_folder(self, source_dir: str, destination_dir: str, new_metadata: dict | None = None) -> list[int]:
        try:
            source_dir = add_slash(source_dir)
            destination_dir = add_slash(destination_dir)
            status_codes = []
            for source_path in self.enum_files(source_dir)[0]:
                metadata = None
                destination_path = source_path.replace(source_dir, destination_dir)
                if new_metadata:
                    metadata = self._client.head_object(Bucket=self.bucket, Key=source_path).get('Metadata', {})
                    metadata.update(new_metadata)
                status_codes.append(self.copy(source_path, destination_path, metadata))
            return status_codes
        except Exception as e:
            logging.error(f'Error copying folder from {source_dir} to {destination_dir}: {e}')
            return []

    def delete_folder(self, path):
        for file_path in self.enum_files(add_slash(path))[0]:
            self.delete(file_path)

    def list_file_names(self, base_path: str, file_name: str, limit: Optional[int] = 100) -> list[Tuple[str, int]]:
        page_token = None
        paths_by_name: dict[str, Tuple[str, int]] = {}
        for _ in range(0, 10):
            file_paths, next_page_token = self.enum_files(base_path, page_token, None)
            for path in file_paths:
                if (re.search(file_name, os.path.splitext(path)[0], flags=re.IGNORECASE)):
                    match = re.search(rf"{re.escape(base_path)}([^/]+)/(\d+)/[^/]+$", path)
                    if match:
                        name = match.group(1)
                        version = int(match.group(2))
                        if name not in paths_by_name or version > paths_by_name[name][1]:
                            paths_by_name[name] = (name, version)
            if limit and len(paths_by_name) >= limit:
                return list(paths_by_name.values())[0:limit]
            if not next_page_token or page_token == next_page_token:
                break
            page_token = next_page_token
        return list(paths_by_name.values())

    def get_multiple(self, file_infos: list[Tuple[str, str, int, str]]) -> Dict[str, Any]:
        resultados = {}
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
            for buffer, metadata, path, name, version in executor.map(self.get_with_info, file_infos):
                resultados[path] = (buffer, metadata, name, version)
        return resultados
