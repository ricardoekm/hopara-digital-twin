import hashlib
import inspect
import logging
import os
import sys
from importlib import util
from pathlib import Path
from typing import Any, Dict, Type

from consumer.worker import ConsumerContainer, Worker


def _snake_to_camel(s: str) -> str:
    return "".join(p.capitalize() for p in s.split("_"))


def _load_module_from_path(py_path: Path) -> object:
    h = hashlib.sha1(str(py_path.resolve()).encode()).hexdigest()[:10]
    mod_name = f"dynworkers.{py_path.stem}_{h}"

    spec = util.spec_from_file_location(mod_name, str(py_path))
    if spec is None or spec.loader is None:
        raise ImportError(f"Cannot load module from {py_path}")
    module = util.module_from_spec(spec)
    sys.modules[mod_name] = module
    spec.loader.exec_module(module)
    return module


def _pick_worker_class(module: Any, base_cls: Any, stem: str) -> Type[Worker]:
    candidates = []
    for name, obj in inspect.getmembers(module, inspect.isclass):
        if issubclass(obj, base_cls) and obj is not base_cls and obj.__module__ == module.__name__:
            candidates.append(obj)

    if not candidates:
        raise LookupError(f"Nenhuma subclasse de {base_cls.__name__} encontrada em {module.__name__}")

    class_name = f'{_snake_to_camel(stem)}Worker'
    by_name = [c for c in candidates if c.__name__ == class_name]
    if len(by_name) == 1:
        return by_name[0]
    raise LookupError(f"Cannot determine Worker class in "f"{module.__name__}, candidates: {candidates}")


def load_workers(container: ConsumerContainer) -> Dict[str, Worker]:
    workers_path = Path(os.path.dirname(os.path.abspath(__file__)))

    mapping: Dict[str, Worker] = {}

    for worker_file_path in workers_path.rglob("*_worker.py"):
        logging.info("loading worker from " + str(worker_file_path))
        if worker_file_path.name.startswith("main_worker"):
            continue

        key = worker_file_path.stem[:-len("_worker")]

        module = _load_module_from_path(worker_file_path)
        cls = _pick_worker_class(module, Worker, stem=key)
        instance = cls(container)
        mapping[key] = instance
    return mapping



