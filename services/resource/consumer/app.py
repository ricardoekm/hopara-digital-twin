import os
from typing import Dict

from flask import Flask, jsonify, make_response, request
from flask_cors import CORS
from google import genai
from openai import OpenAI

from common.client.cloudfront_cache import CloudFront
from common.client.local_storage import LocalStorage
from common.client.noop_cache import NoOpCache
from common.client.noop_queue import NoOpQueue
from common.client.s3_storage import S3Storage
from common.client.sqs_queue import SQSQueue
from common.client.sync_queue import SyncQueue
from common.client.storage import Storage
from common.dictionary import get_bool
from common.logger import setup_logger
from common.resource_state import ResourceState
from common.server_util import handle_exception
from consumer.main_worker import MainWorker
from consumer.model.model_service import ModelService
from consumer.notifier import Notifier
from consumer.worker import ConsumerContainer, Worker
from consumer.worker_loader import load_workers

setup_logger()

queue_strategy = os.getenv('QUEUE_STRATEGY', 'SYNC')
if queue_strategy == 'SQS':
    queue = SQSQueue(os.getenv('SQS_RESOURCE_QUEUE', 'resources-test'))
elif queue_strategy == 'SYNC':
    queue = SyncQueue(os.getenv('CONSUMER_URL', 'http://127.0.0.1:2023'))
else:
    queue = NoOpQueue()

if os.getenv('STORAGE_STRATEGY', 'LOCAL_STORAGE') == 'S3':
    storage: Storage = S3Storage(os.getenv('S3_BUCKET', ''))
else:
    storage = LocalStorage(os.getenv('LOCAL_STORAGE_PATH', '../resources/'))

if os.getenv('CACHE_STRATEGY', 'NO_OP') == 'CLOUD_FRONT':
    cache = CloudFront(os.getenv('CLOUDFRONT_DISTRIBUTION_ID', 'E385PQSKW0ARQ1'))
else:
    cache = NoOpCache()

model_service = ModelService()
model_generation_service = None
image_generation_service = None

container = ConsumerContainer(
    image_generation_service=image_generation_service,
    model_generation_service=model_generation_service,
    model_service=model_service
)

workers: Dict[str, Worker] = load_workers(container)

notifier = Notifier()
consumer = MainWorker(queue, storage, cache, workers, notifier)

def process_message():
    is_async = get_bool(request.args, 'async', default=False)
    message = request.get_json()
    if message is None:
        return make_response(jsonify({"status": "error", "message": "No body provided"}), 400)
    if is_async:
        consumer.process_async(message)
        return make_response(jsonify({'status': 'InProgress'}), 202)
    if consumer.process_sync(message) == ResourceState.SUCCESS:
        return make_response(jsonify({'status': 'OK'}), 200)
    return make_response(jsonify({'status': 'InProgress'}), 202)


def health():
    return make_response(jsonify({'message': 'Resource Consumer is alive :)'}), 200)


def create_app():
    app = Flask(__name__)
    app.register_error_handler(Exception, handle_exception)
    app.add_url_rule('/process_message', 'process_message', process_message, methods=['PUT'])
    app.add_url_rule('/health', 'health', health, methods=['GET'])
    CORS(app)
    consumer.start_listening()
    return app
