from dataclasses import dataclass, field
from typing import Optional

from common.resource_state import ResourceState


@dataclass
class ResourceResult:
    state: ResourceState
    buffer: Optional[bytes] = None
    metadata: dict = field(default_factory=dict)
    version: Optional[int] = None

    @staticmethod
    def not_found() -> "ResourceResult":
        return ResourceResult(ResourceState.NOT_FOUND, None)

    @staticmethod
    def success(buffer: bytes | None, metadata: Optional[dict]) -> "ResourceResult":
        return ResourceResult(ResourceState.SUCCESS, buffer, metadata or {})

    @staticmethod
    def processing(buffer: Optional[bytes] = None, metadata: Optional[dict] = None) -> "ResourceResult":
        return ResourceResult(ResourceState.PROCESSING, buffer, metadata or {})

    @staticmethod
    def error() -> "ResourceResult":
        return ResourceResult(ResourceState.ERROR)

    def is_valid(self):
        return self.state in (ResourceState.SUCCESS, ResourceState.PROCESSING)
