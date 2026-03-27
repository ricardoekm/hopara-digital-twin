from typing import Any, Dict, List

import casestyle
from typing_extensions import Optional

from api.icon.Icon_path import IconPath
from api.icon.icon_repository import IconRepository
from api.icon.search.search_engine import SearchEngine
from api.resource.library import Library
from api.resource.library_repository import LibraryRepository
from api.resource.resource_process_client import ResourceProcessClient
from api.resource.resource_sort import resource_sort
from common.client.cache import Cache
from common.mimetype import discover_mimetype
from common.process_resource_event import ResourceStep
from common.resource_result import ResourceResult
from common.resource_state import ResourceState
from api.icon.search.tenant_context_repository import TenantContextRepository

allowed_types = ['image/jpeg', 'image/png', 'image/svg+xml', 'image/svg']


def drop_duplicates(values):
    dedup_values = []
    for value in values:
        if value in dedup_values:
            continue
        dedup_values.append(value)
    return dedup_values


class IconService:
    repository: IconRepository
    library_repository: LibraryRepository
    process_client: ResourceProcessClient
    search_engine: SearchEngine
    tenant_context_repository: TenantContextRepository

    def __init__(
            self, repository: IconRepository, library_repository: LibraryRepository,
            process_client: ResourceProcessClient, cache: Cache, search_engine: SearchEngine,
            tenant_context_repository: TenantContextRepository
    ):
        self.repository = repository
        self.library_repository = library_repository
        self.search_engine = search_engine
        self.process_client = process_client
        self.cache = cache
        self.tenant_context_repository = tenant_context_repository

    @staticmethod
    def check_library_permission(tenant: str, library: Optional[str]) -> None:
        if library and tenant != library:
            raise ValueError('Cannot change a read only library')

    def _find_in_libraries(
            self, tenant: str, libraries: List[Library], name: str, try_normalized: bool,
    ) -> ResourceResult:
        for library in libraries:
            icon = self.repository.get(tenant, library.name, name)
            if icon.is_valid():  return icon
            if try_normalized:
                stripped_name = name.strip(' .')
                if stripped_name != name:
                    icon = self.repository.get(tenant, library.name, stripped_name)
                if icon.is_valid():  return icon
                kebab_name = casestyle.kebabcase(name)
                if kebab_name != name:
                    return self.repository.get(tenant, library.name, kebab_name)
        return ResourceResult.not_found()

    def _process_icon(
            self, cwd: str, origin: str, destination: str, invalidation_urls: List[str],
    ) -> ResourceState:
        message = ResourceStep(
            cwd=cwd,
            type='icon_resize',
            data={
                'origin': origin,
                'destination': destination,
            },
            invalidation_urls=invalidation_urls,
            ready=True,
        )
        return self.process_client.process_sync(message)

    def _process_and_save(self, cwd: str, original_path: str, processed_path: str,
                          invalidation_urls: List[str]) -> ResourceState:
        return self._process_icon(cwd, original_path, processed_path, invalidation_urls)

    def list_all(self, tenant: str, query: str, limit: int) -> List[Dict]:
        icons = []
        # tenant icons
        tenant_icons, _ = self.repository.list(tenant, tenant, query=query.lower())
        if tenant_icons:
            resource_sort(tenant_icons, query)
            icons += tenant_icons
        if len(icons) >= limit:
            return icons[:limit]

        # smart search icons
        tenant_context = self.tenant_context_repository.get(tenant)
        smart_icons = self.search_engine.embedding_search(query, limit - len(icons), None, True, tenant_context.language, tenant_context.domain)
        if smart_icons:
            icons += [{"name": icon['name']} for icon in smart_icons]
        if len(icons) >= limit:
            return icons[:limit]

        # all icons
        libraries = [library.name for library in self.library_repository.list(tenant)]
        for library in libraries:
            if library == tenant:
                continue
            library_icons, _ = self.repository.list(tenant, library, limit=limit - len(icons), query=query.lower())
            if library_icons:
                resource_sort(library_icons, query)
                icons += library_icons
                icons = drop_duplicates(icons)
                if len(icons) >= limit:
                    break
        return icons[:limit]

    def list_from_library(self, tenant, library, page_token, limit, query):
        tenant_context = self.tenant_context_repository.get(tenant)
        smart_icons = self.search_engine.embedding_search(query, limit, library, True, tenant_context.language, tenant_context.domain)
        if smart_icons:
            return [{"name": icon['name']} for icon in smart_icons], None

        items, next_page_token = self.repository.list(tenant, library, page_token, limit, query.lower())
        resource_sort(items, query)
        return items, next_page_token

    def list_libraries(self, tenant):
        libraries = self.library_repository.list(tenant)
        return libraries[::-1]

    def get_library(self, tenant, library):
        return self.library_repository.get(tenant, library)

    def find(
            self, tenant: str, name: str, fallback: str | None = None, smart_search: bool | None = True
    ) -> ResourceResult:
        libraries = self.library_repository.list(tenant)
        result: ResourceResult = self._find_in_libraries(tenant, libraries, name, True)
        if result.state == ResourceState.SUCCESS:
            return result
        if smart_search:
            tenant_library = libraries[0]
            result = self._find_in_libraries(tenant, [tenant_library], name, True)
            if result.state == ResourceState.SUCCESS:
                return result

        should_be_temporary = False
        if smart_search:
            tenant_context = self.tenant_context_repository.get(tenant)
            smart_name = self.search_engine.search(name, tenant_context.language, tenant_context.domain)
            should_be_temporary = smart_name is None  # When None is returned, it means an error occurred
            if smart_name and smart_name != 'none' and isinstance(smart_name, dict):
                smart_name_libs: list[Any] = list(
                    filter(lambda lib: smart_name.get('metadata', {}).get(lib.name, False), libraries),  # type: ignore[arg-type]
                )
                result = self._find_in_libraries(tenant, smart_name_libs, smart_name.get('name', ''), False)
                if result.state == ResourceState.SUCCESS:
                    return result

        if fallback:
            result = self._find_in_libraries(tenant, libraries, fallback, True)

        if result.is_valid():
            result.metadata['metadata'] = should_be_temporary
            return result
        return ResourceResult.not_found()

    def delete(self, tenant: str, library: str | None, name: str) -> ResourceState:
        state = self.repository.delete(tenant, library, name)
        if state == ResourceState.SUCCESS:
            self.cache.invalidate([IconPath.get_invalidation_path(tenant)])
        return state

    def get(self, tenant: str, library: str | None, name: str, fallback: Optional[str] = None) -> ResourceResult:
        resource = self.repository.get(tenant, library, name)
        if resource:
            return resource
        if fallback:
            return self.repository.get(tenant, library, fallback)
        return ResourceResult.not_found()

    def save(
            self, tenant: str, library: str | None, name: str,
            buffer: bytes, bypass_check: bool = False,
            skip_invalidation: bool = False
    ) -> ResourceResult:
        if not bypass_check:
            self.check_library_permission(tenant, library)
        if not buffer or len(buffer) <= 0:
            raise ValueError('Original resource buffer is empty')
        mimetype = discover_mimetype(buffer)
        if mimetype not in allowed_types: raise ValueError(f'Invalid image type: {mimetype}')
        cwd = IconPath.get_base_dir(tenant, library)
        self.repository.save(tenant, library, name, buffer)
        processed_path = IconPath.get_processed_filename(name)
        original_path = IconPath.get_original_filename(name)
        invalidation_urls = [IconPath.get_invalidation_path(tenant)] if not skip_invalidation else []
        state = self._process_and_save(cwd, original_path, processed_path, invalidation_urls)
        if state == ResourceState.SUCCESS or state == ResourceState.PROCESSING:
            return self.get(tenant, library, name)
        return ResourceResult(state)
