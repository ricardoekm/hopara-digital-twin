from typing import Any, TypeVar, cast

K = TypeVar("K")
V = TypeVar("V")


def get_with_default(d: Any, key: K, default: V) -> V:
    ret = cast(V, d.get(key, default))
    if ret is None:
        return default
    return ret


def get_bool(d: Any, key: K, default: bool = False) -> bool:
    value = d.get(key, default)
    if isinstance(value, str):
        return value.lower() in ['true', '1']
    return bool(value)
