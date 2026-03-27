import logging
import os
import threading
from time import time
from urllib.parse import quote

import boto3  # type: ignore

from common.client.cache import Cache
from common.dictionary import get_bool


def url_encode(url):
    return quote(url, safe='~!@#$&*()=:/,;?+')


class CloudFront(Cache):
    def __init__(self, distribution_id: str):
        logging.info(f'CloudFront distribution_id={distribution_id}')
        self.__client = boto3.client('cloudfront')
        self.distribution_id = distribution_id
        self._pending_paths: list[str] = []
        self._lock = threading.Lock()
        self._timer: threading.Timer | None = None

    def _invalidate(self, paths: list[str]) -> None:
        if len(paths) == 0:
            return None
        try:
            items = [url_encode(p) for p in paths]
            response = self.__client.create_invalidation(
                DistributionId=self.distribution_id,
                InvalidationBatch={
                    'Paths': {
                        'Quantity': len(items),
                        'Items': items
                    },
                    'CallerReference': str(time()).replace(".", "")
                }
            )
            code = response['ResponseMetadata']['HTTPStatusCode']
            if code > 299:
                raise ValueError(f'Invalidation failed with status code {code}')
        except Exception as error:
            logging.error(f'{self.distribution_id} | {paths} | {error=}')
            raise error
        return None

    def invalidate(self, paths: list[str]) -> None:
        if len(paths) == 0:
            return None
        with self._lock:
            self._pending_paths.extend(paths)
            if self._timer is None:
                self._timer = threading.Timer(2.0, self._flush)
                self._timer.start()

    def _flush(self) -> None:
        with self._lock:
            paths = list(set(self._pending_paths))
            self._pending_paths.clear()
            self._timer = None
        if not paths:
            return
        self._invalidate(paths)
