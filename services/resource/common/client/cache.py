from abc import ABC, abstractmethod


class Cache(ABC):
    @abstractmethod
    def invalidate(self, paths: list[str]) -> None:
        ...

