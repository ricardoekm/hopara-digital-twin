import json
import logging
import os
import sys
from datetime import datetime

from dotenv import load_dotenv

load_dotenv()
log_level = os.environ.get("LOG_LEVEL", "WARNING").upper()


class HealthCheckFilter(logging.Filter):
    """Filter out health check requests from logs."""

    def filter(self, record: logging.LogRecord) -> bool:
        message = record.getMessage()
        # Filter out health check requests
        if '/health' in message and ('GET' in message or 'HEAD' in message):
            return False
        return True


class JsonFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        obj = {
            "timestamp": datetime.now().isoformat(timespec='milliseconds'),
            "level": record.levelname,
            "message": record.getMessage(),
        }
        return json.dumps(obj, ensure_ascii=False)


def setup_logger() -> None:
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JsonFormatter())
    handler.addFilter(HealthCheckFilter())

    root_logger = logging.getLogger()
    root_logger.handlers.clear()
    root_logger.addHandler(handler)
    root_logger.setLevel(log_level)

    logging.basicConfig(handlers=[handler], level=log_level, force=True)

    for logger_name in ['twisted', 'root', '__main__', 'werkzeug']:
        logger = logging.getLogger(logger_name)
        logger.handlers.clear()
        logger.addHandler(handler)
        logger.setLevel(log_level)
        logger.propagate = False
