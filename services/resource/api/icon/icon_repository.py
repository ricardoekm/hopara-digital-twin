import os
from typing import List, Optional, Tuple
from urllib.parse import quote, unquote

from api.icon.Icon_path import IconPath
from common.client.storage import Storage
from common.resource_result import ResourceResult
from common.resource_state import ResourceState


class IconRepository:
    def __init__(self, s3: Storage):
        self.storage = s3

    def save(self, tenant, library, name, buffer):
        path = IconPath.get_original_filepath(tenant, library, name)
        self.storage.upload(buffer, path)

    def delete(self, tenant: str, library: Optional[str], name: str) -> ResourceState:
        paths = [
            IconPath.get_processed_filepath(tenant, library, name),
            IconPath.get_original_filepath(tenant, library, name)
        ]
        status_code = 0
        for path in paths:
            status_code = max(status_code, self.storage.delete(path))
        if status_code < 400:
            return ResourceState.SUCCESS
        return ResourceState.ERROR

    def list(
            self, tenant: str, library: str, page_token: Optional[str] = None, limit: Optional[int] = 100,
            query: Optional[str] = '',
    ) -> Tuple[List[dict], str | None]:
        path = IconPath.get_processed_path(tenant, library)
        if query:
            files, next_page_token = self.storage.search_files(path, quote(query, ""), limit), None
        else:
            files, next_page_token = self.storage.enum_files(path, page_token, limit)

        files = list(filter(lambda f: not f.endswith('.metadata'), files))
        return [{'name': unquote(os.path.splitext(os.path.basename(file))[0])} for file in files], next_page_token

    def get(self, tenant: str, library: Optional[str], name: str) -> ResourceResult:
        path = IconPath.get_processed_filepath(tenant, library, name)
        buffer, metadata = self.storage.get(path)
        if not buffer: return ResourceResult.not_found()

        metadata = metadata or {}
        return ResourceResult.success(buffer, {
            "width": int(metadata.get('width', 0)),
            "height": int(metadata.get('height', 0)),
            'library': library,
            'tenant': tenant,
            'name': name,
        }, )
