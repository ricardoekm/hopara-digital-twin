from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class TenantContext:
    language: str
    domain: str


class TenantContextRepository(ABC):
    @abstractmethod
    def get(self, tenant_name: str) -> TenantContext:
        ...
