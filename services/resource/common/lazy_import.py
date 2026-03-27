import importlib
import logging
import sys


def lazy_import(module_name, reload=False):
    if module_name not in sys.modules:
        mod = importlib.import_module(module_name)
        logging.getLogger(module_name).setLevel(logging.CRITICAL)
        return mod
    elif reload:
        importlib.reload(sys.modules[module_name])
    return sys.modules[module_name]
