from typing import Any, Dict, List

from common.client.s3_storage import S3Storage
from common.resource_path import ResourcePath
from common.version import VersionFactory, list_history_items


class ResourceHistoryRepository:
    storage: S3Storage
    version_factory: VersionFactory

    def __init__(self, storage: S3Storage, resource_type: str):
        self.storage = storage
        self.version_factory = VersionFactory()
        self.resource_type = resource_type

    def list(self, tenant: str, library: str, name: str, limit: int | None = None) -> List[Dict[str, Any]]:
        versions = self.storage.get_versions(
            ResourcePath.get_base_dir(self.resource_type, tenant, library, name))
        return list_history_items(versions, limit)

    def restore(self, tenant: str, library: str, name: str, requested_version: int) -> int:
        processed_path = ResourcePath.get_base_dir(self.resource_type, tenant, library, name)
        versions = self.storage.get_versions(processed_path)
        new_metadata, new_version_empty_path, version, new_version = self.version_factory.get_version(
            versions, processed_path, requested_version
        )

        if version == 0:
            self.storage.upload(b'empty', new_version_empty_path)
            return 0
        else:
            version_original_path = ResourcePath.get_version_dir(
                self.resource_type, tenant, library, name, version
            )
            new_version_original_path = ResourcePath.get_version_dir(
                self.resource_type, tenant, library, name, new_version
            )
            self.storage.copy_folder(
                version_original_path, new_version_original_path, new_metadata,
            )
            version_processed_path = ResourcePath.get_version_dir(
                self.resource_type, tenant, library, name, version
            )
            new_version_processed_path = ResourcePath.get_version_dir(
                self.resource_type, tenant, library, name, new_version
            )
            self.storage.copy_folder(version_processed_path, new_version_processed_path, new_metadata)
        return new_version

    def undo(self, tenant: str, library: str, name: str, version_to_undo: int) -> int:
        base_dir = ResourcePath.get_base_dir(self.resource_type, tenant, library, name)
        versions = self.storage.get_versions(base_dir)
        if len(versions) == 1:
            self.storage.delete_folder(base_dir)
            return 0

        if version_to_undo not in versions:
            raise ValueError(f"Version {version_to_undo} not found in history for {tenant}/{library}/{name}")

        index = versions.index(version_to_undo)
        undo_index = index + 1
        undo_version = versions[undo_index] if undo_index < len(versions) else 0
        return self.restore(tenant, library, name, undo_version)
