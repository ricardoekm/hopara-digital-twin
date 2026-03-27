import os

from api.paths import get_processed_libraries_dir
from api.resource.library import Library
from common.client.storage import Storage


class LibraryRepository:
    def __init__(self, resource_type: str, storage: Storage):
        self.storage = storage
        self.resource_type = resource_type

    def list(self, tenant: str) -> list[Library]:
        libraries = self.storage.enum_folders(get_processed_libraries_dir(self.resource_type), fast_mode=True)
        libraries = sorted([os.path.basename(library.rstrip('/')) for library in libraries])
        if 'general' in libraries:
            libraries.remove('general')
            libraries += ['general']
        libraries = [tenant] + libraries
        items = [self.get(tenant, library) for library in libraries]
        return [item for item in items if item is not None]

    def get(self, tenant: str, library: str) -> Library | None:
        if library == tenant:
            return Library(tenant, tenant, True)
        return Library(tenant, library, False)
