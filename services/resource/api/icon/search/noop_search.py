from typing import Any

from api.icon.search.search_engine import SearchEngine

class NoOpSearchEngine(SearchEngine):
    def search(self, text, language=None, domain=None) -> dict | str | None:
        return None

    def embedding_search(self, text, k=10, library=None, include_variants=True, language=None, domain=None) -> list[dict[str, Any]]:
        return []
