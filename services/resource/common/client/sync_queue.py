import json
import logging
import queue
import threading
from typing import List

import requests

from common.client.queue import Queue
from common.process_resource_event import ResourceStep


class SyncQueue(Queue):
    """Queue that forwards each message to the consumer via a synchronous HTTP call.

    Messages are buffered in an in-memory queue and processed one at a time
    by a background thread.
    """

    def __init__(self, consumer_url: str):
        self.consumer_url = consumer_url.rstrip('/')
        self._queue: queue.Queue[dict] = queue.Queue()
        self._session = requests.Session()
        self._thread = threading.Thread(target=self._process_loop, daemon=True)
        self._thread.start()
        logging.info(f'SyncQueue initialized, forwarding to {self.consumer_url}')

    def _process_loop(self) -> None:
        while True:
            message = self._queue.get()
            try:
                url = f'{self.consumer_url}/process_message'
                response = self._session.put(url, json=message)
                if response.status_code >= 400:
                    logging.error(
                        'SyncQueue: consumer returned %s for message: %s',
                        response.status_code, json.dumps(message)[:200],
                    )
            except Exception:
                logging.exception('SyncQueue: error forwarding message to consumer')
            finally:
                self._queue.task_done()

    def get_name(self) -> str:
        return 'SyncQueue'

    def receive_messages(self) -> list:
        return []

    def delete_message(self, message) -> None:
        return None

    def send_message(self, payload) -> str | None:
        self._queue.put(payload)
        return None

    def send_messages(self, payloads: List[ResourceStep]) -> None:
        for payload in payloads:
            self.send_message(payload)
