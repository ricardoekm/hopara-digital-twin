from enum import Enum


class ResourceState(Enum):
    SUCCESS = "success"
    PROCESSING = "processing"
    NOT_FOUND = "not_found"
    ERROR = "error"
