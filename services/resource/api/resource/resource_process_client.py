import logging
from typing import List

import requests

from common.process_resource_event import ResourceStep
from common.resource_state import ResourceState


class ResourceProcessClient:
    def __init__(self, host, queue):
        self.host = host
        self.queue = queue
        self.session = requests.Session()

    def process_sync(self, message: ResourceStep) -> ResourceState:
        print(f'{self.host=}, {self.queue=}, {message=}')
        url = requests.compat.urljoin(self.host, 'process_message')
        response = self.session.put(url, json=message)
        print(f'{response=}')
        if response.status_code == 200: return ResourceState.SUCCESS
        if response.status_code == 202: return ResourceState.PROCESSING

        logging.error(
            'Server error sync_process_resource: message=%s status_code=%s response=%s',
            message, response.status_code, response.json
        )
        return self.process_async(message)

    def process_async(self, message: ResourceStep) -> ResourceState:
        self.queue.send_message(message)
        return ResourceState.PROCESSING

    def process_many_async(self, messages: List[ResourceStep]) -> List[ResourceState]:
        results = []
        for message in messages:
            result = self.process_async(message)
            results.append(result)
        return results
