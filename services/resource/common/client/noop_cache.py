from common.client.cache import Cache


class NoOpCache(Cache):
    def invalidate(self, paths: list[str]) -> None:
        return None
