import logging
import os

from dependency_injector import containers, providers

from api.icon.icon_repository import IconRepository
from api.icon.icon_service import IconService
from api.icon.search.search_engine import SearchEngine
from api.icon.search.noop_search import NoOpSearchEngine
from api.image.image_repository import ImageRepository
from api.image.image_service import ImageService
from api.image.image_shape_repository import ImageShapeRepository
from api.model.model_repository import ModelRepository
from api.model.model_service import ModelService
from api.resource.library_repository import LibraryRepository
from api.resource.resource_history_repository import ResourceHistoryRepository
from api.resource.resource_process_client import ResourceProcessClient
from common.client.cache import Cache
from common.client.cloudfront_cache import CloudFront
from common.client.local_storage import LocalStorage
from common.client.noop_cache import NoOpCache
from common.client.noop_queue import NoOpQueue
from common.client.queue import Queue
from common.client.s3_storage import S3Storage
from common.client.sqs_queue import SQSQueue
from common.client.sync_queue import SyncQueue
from common.client.storage import Storage
from common.dictionary import get_bool
from common.logger import setup_logger
from api.icon.search.fixed_tenant_context_repository import FixedTenantContextRepository

CONSUMER_URL = os.getenv("CONSUMER_URL", 'http://127.0.0.1:2023')
DISABLE_LOCALSTACK = get_bool(os.environ, "DISABLE_LOCALSTACK", False)

setup_logger()

logging.info({
    "CONSUMER_URL": CONSUMER_URL,
    "DISABLE_LOCALSTACK": DISABLE_LOCALSTACK,
})


class Container(containers.DeclarativeContainer):
    modules = [
        "api.routes",
        "api.model.model_routes",
        "api.icon.icon_routes",
        "api.image.image_routes"
    ]
    if os.getenv('RUNNING_TEST') == 'true':
        modules.extend(
            [
                "tests.api.icon.test_system_icon",
                "tests.api.image.test_system_image",
                "tests.api.model.test_system_model",
                "tests.api.icon.test_icon_repository",
            ],
        )
    wiring_config = containers.WiringConfiguration(modules=modules)
    config = providers.Configuration()

    if os.getenv('STORAGE_STRATEGY', 'LOCAL_STORAGE') == 'S3':
        config.s3.bucket.from_env("S3_BUCKET", '')
        storage: providers.ThreadSafeSingleton[Storage] = providers.ThreadSafeSingleton(S3Storage, config.s3.bucket)
    else:
        config.local_storage.path.from_env('LOCAL_STORAGE_PATH', '../resources/')
        storage = providers.ThreadSafeSingleton(LocalStorage, config.local_storage.path)

    config.consumer_url.from_env("CONSUMER_URL", 'http://127.0.0.1:2023')

    queue_strategy = os.getenv('QUEUE_STRATEGY', 'SYNC')
    if queue_strategy == 'SQS':
        config.sqs_resource_queue.from_env('SQS_RESOURCE_QUEUE', '')
        queue: providers.ThreadSafeSingleton[Queue] = providers.ThreadSafeSingleton(SQSQueue, config.sqs_resource_queue)
    elif queue_strategy == 'SYNC':
        queue = providers.ThreadSafeSingleton(SyncQueue, config.consumer_url)
    else:
        queue = providers.ThreadSafeSingleton(NoOpQueue)

    process_client = providers.ThreadSafeSingleton(ResourceProcessClient, config.consumer_url, queue)

    if os.getenv('CACHE_STRATEGY', 'NO_OP') == 'CLOUD_FRONT':
        config.cloud_front.distribution_id.from_env("CLOUDFRONT_DISTRIBUTION_ID", '')
        cache: providers.ThreadSafeSingleton[Cache] = providers.ThreadSafeSingleton(CloudFront, config.cloud_front.distribution_id)
    else:
        cache = providers.ThreadSafeSingleton(NoOpCache)

    icon_repository = providers.ThreadSafeSingleton(IconRepository, storage)

    image_repository = providers.ThreadSafeSingleton(ImageRepository, storage)
    image_history_repository = providers.ThreadSafeSingleton(ResourceHistoryRepository, storage, 'image')
    image_shape_repository = providers.ThreadSafeSingleton(ImageShapeRepository, storage)

    model_repository = providers.ThreadSafeSingleton(ModelRepository, storage)
    model_history_repository = providers.ThreadSafeSingleton(ResourceHistoryRepository, storage, 'model')

    icon_library_repository = providers.ThreadSafeSingleton(LibraryRepository, 'icon', storage)
    model_library_repository = providers.ThreadSafeSingleton(LibraryRepository, 'model', storage)

    search_engine = providers.ThreadSafeSingleton[SearchEngine](NoOpSearchEngine)
    tenant_context_repository = providers.ThreadSafeSingleton(FixedTenantContextRepository)

    icon_service = providers.ThreadSafeSingleton(IconService, icon_repository, icon_library_repository, process_client,
                                                 cache, search_engine, tenant_context_repository)
    image_service = providers.ThreadSafeSingleton(
        ImageService, image_repository, queue, cache, process_client, image_history_repository, image_shape_repository
    )
    model_service = providers.ThreadSafeSingleton(
        ModelService, model_repository, model_library_repository, process_client, model_history_repository
    )
