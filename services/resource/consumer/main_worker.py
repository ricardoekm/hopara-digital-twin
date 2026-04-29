import json
import logging
import queue
import threading
from typing import Any, Dict, List, cast

import requests

from common.client.cache import Cache
from common.client.queue import Queue
from common.client.storage import Storage
from common.process_resource_event import EventData, ResourceStep
from common.resource_state import ResourceState
from consumer.notifier import Notifier
from consumer.worker import Worker


class MainWorker:
    def __init__(
            self, queue: Queue, storage: Storage, cache: Cache,
            workers: Dict[str, Worker],
            notifier: Notifier
    ):
        logging.info(f'Consumer initialized. Listening queue {queue.get_name() if queue else None}...')
        self.storage = storage
        self.cache = cache
        self.queue = queue
        self.thread = None
        self.stopped = False
        self.session = requests.Session()
        self.workers = workers
        self.notifier = notifier

    def __del__(self):
        self.stop_listening()

    @staticmethod
    def validate_step(step: ResourceStep) -> None:
        if not step.get('type', None):
            raise ValueError('Payload has no type')
        data = step.get('data', None)
        if data is None:
            raise ValueError("Payload data is missing")
        origin = data.get('origin')
        if not data.get('origin'):
            raise ValueError(f'Invalid path: {origin=}')
        destinations = MainWorker.get_destinations_from_step(step)
        if len(destinations) == 0:
            raise ValueError('No destinations provided')

    def get_input_data(self, cwd: str, metadata: EventData) -> tuple[bytes, dict]:
        input_buffer, original_metadata = self.storage.get(metadata.get("origin", ""), cwd=cwd)
        original_metadata = original_metadata or {}
        if not input_buffer:
            raise ValueError(f"Input file not found: {cwd=}{metadata.get('origin', '')}")
        return input_buffer, original_metadata

    def upload(self, step: ResourceStep, buffers: List[bytes], metadata: dict, cwd: str = '') -> None:
        additional_metadata = cast(Dict, step["data"].get('metadata', {}))
        destinations = self.get_destinations_from_step(step)

        for i, buffer in enumerate(buffers):
            destination = destinations[i]
            additional_metadata.update(metadata or {})
            self.storage.upload(buffer, destination, additional_metadata, cwd=cwd)

    @staticmethod
    def get_destinations_from_step(step: ResourceStep) -> List[str]:
        data = step.get('data', None)
        if data:
            destination = data.get('destination')
            destinations = data.get('destinations', []) or []
            if destination:
                destinations.append(destination)
            return destinations
        steps = step.get('steps', [])
        if len(steps) > 0:
            return MainWorker.get_destinations_from_step(steps[0])
        return []

    def process_payload(
            self, payload: ResourceStep,
            message_id: str | None = None
    ) -> ResourceState:
        if len(payload.get('steps', [])) > 0:
            if payload['type'] == 'parallel':
                self.queue.send_messages(payload.get('steps', []))
                return ResourceState.PROCESSING
            else:
                step = payload['steps'][0]
                if step['type'] == 'parallel':
                    self.queue.send_messages(step.get('steps', []))
                    return ResourceState.PROCESSING
        else:
            step = payload

        cwd = step.get('cwd', '')
        write_cwd = step.get('destination_cwd') or cwd
        self.validate_step(step)
        step_type = step['type']
        worker = self.workers.get(step_type)
        if not worker:
            # Silently ignore, as this can happen for cloud features
            return ResourceState.SUCCESS

        data: Any = step.get('data', {})
        origin = data.get('origin')
        destinations = data.get('destinations', [])

        logging.info(f"Processing message: {message_id} => {step_type}")
        logging.debug(
            f"cwd: {cwd} origin: {origin}, destinations: {destinations}, destination: {data.get('destination', None)}"
        )

        destination = self.get_destinations_from_step(step)[0]

        if not self.storage.file_exists(destination, cwd=write_cwd) or not step.get('use_cache', False):
            input_buffer, original_metadata = self.get_input_data(cwd, data)
            output_buffers, metadata = worker.process(step["data"], input_buffer, original_metadata)
            self.upload(step, output_buffers, metadata, cwd=write_cwd)
            self.cache.invalidate(step.get('invalidation_urls', []))

        steps = payload.get('steps', [])
        next_steps = steps[1:] if len(steps) > 1 else []

        has_more = len(next_steps) > 0
        ready = step.get('ready', False)
        if has_more:
            self.queue.send_message({"type": "sequential", 'steps': next_steps})
        notification = step.get('notification', None)
        if notification:
            processing_payload = {'processing': True}
            processing_payload.update(cast(Any, notification))
            progress = notification.get('progress', None)
            if progress is not None:
                self.notifier.notify(notification)
        logging.info(f"Processed message: {message_id} => {step_type}")
        if ready or not has_more:
            return ResourceState.SUCCESS
        return ResourceState.PROCESSING

    @staticmethod
    def run_and_capture_exceptions(fn, args, error_queue, result_queue):
        try:
            result = fn(args)
            result_queue.put(result)
        except Exception as e:
            error_queue.put(e)

    def process_async(self, payload: List[ResourceStep]) -> None:
        self.queue.send_message(payload)

    def process_sync(self, payload: List[ResourceStep]) -> ResourceState:
        error_queue: queue.Queue[Any] = queue.Queue()
        result_queue: queue.Queue[ResourceState] = queue.Queue()
        thread = threading.Thread(
            target=self.run_and_capture_exceptions,
            args=(self.process_payload, payload, error_queue, result_queue)
        )
        thread.daemon = True
        thread.start()
        step = payload[0] if isinstance(payload, list) else payload
        timeout = step.get('timeout', 30)
        thread.join(timeout)

        if not error_queue.empty():
            raise error_queue.get()

        if thread.is_alive():
            logging.debug('send to queue', payload)
            return ResourceState.PROCESSING

        if not result_queue.empty():
            result = result_queue.get()
            return result

        return ResourceState.SUCCESS

    def listen(self):
        if self.queue is None:
            logging.error("Queue name not provided, message pooling not started.")
            return

        while not self.stopped:
            logging.debug(f'Waiting for messages at {self.queue.get_name()}...')
            self.process_queue_messages()

    def process_queue_message(self, message):
        body = message.get('Body')
        message_id = message.get('MessageId', 'unknown')
        try:
            if not body:
                logging.warning("Received empty message body, skipping.")
            payload = json.loads(body)
            self.process_payload(payload, message_id)
            self.queue.delete_message(message)
        except Exception as error:
            logging.error(f"Error processing message: {message_id=}\n{body=}\n{error=}")

    def process_queue_messages(self):
        messages = self.queue.receive_messages()
        if messages:
            for message in messages:
                self.process_queue_message(message)

    def stop_listening(self):
        if self.thread:
            self.stopped = True
            self.thread.join()
            self.thread = None

    def start_listening(self):
        if not self.thread:
            self.thread = threading.Thread(target=self.listen)
            self.thread.daemon = True
            self.stopped = False
            self.thread.start()
