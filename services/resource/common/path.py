import os


def path_join(first: str | int | None, *others: str | int | None) -> str:
    stripped = [str(other).lstrip(os.sep) for other in others]
    return os.path.join(str(first), *stripped)
