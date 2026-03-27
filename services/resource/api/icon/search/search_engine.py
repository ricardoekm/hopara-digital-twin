from abc import ABC, abstractmethod
from typing import Any


class SearchEngine(ABC):
    @abstractmethod
    def search(self, text, language=None, domain=None) -> dict | str | None:
        ...

    @abstractmethod
    def embedding_search(self, text, k=10, library=None, include_variants=True, language=None, domain=None) -> list[dict[str, Any]]:
        ...
