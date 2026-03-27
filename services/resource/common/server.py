import json
import logging
# This is a fake import, only used during type checking.
from typing import TYPE_CHECKING, Any, Callable, Iterable, cast

from prometheus_client import REGISTRY
from prometheus_client.registry import Collector
from prometheus_client.twisted import MetricsResource
from twisted import logger
from twisted.internet import reactor
from twisted.internet.endpoints import TCP4ServerEndpoint
from twisted.internet.protocol import Factory
from twisted.logger import STDLibLogObserver
from twisted.python import threadpool
from twisted.python.log import ILogObserver
from twisted.web.http import Request, proxiedLogFormatter
from twisted.web.server import Site
from twisted.web.wsgi import WSGIResource

from common.metrics import TwistedThreadPoolCollector

if TYPE_CHECKING:
    from wsgiref.types import WSGIApplication

LogFormatter = Callable[[str, Request], str]


class KubernetesWSGISite(Site):
    """Extension to Site to ignore heath checks for access logging."""

    def __init__(self, health_check_path: str, *args: Any, **kwargs: Any) -> None:
        self.__health_check_path = health_check_path
        super().__init__(*args, **kwargs)

    def log(self, param):
        return super().log(param)


class MetricsSite(Site):
    """Extension to Site to never produce access logs."""

    def log(self, param):
        return super().log(param)


def serve(
        application: "WSGIApplication",
        port: int = 2022,
        metrics_port: int = 9000,
        access_log_formatter: LogFormatter = proxiedLogFormatter,
        health_check_path: str = "/health",
) -> None:
    # Quiet the Twisted factory logging.
    Factory.noisy = True

    observers = [STDLibLogObserver()]
    logger.globalLogBeginner.beginLoggingTo(
        cast(Iterable[ILogObserver], observers), redirectStandardIO=False,
    )

    # Create the server.
    pool = threadpool.ThreadPool(maxthreads=30)
    reactor.callWhenRunning(pool.start)  # type: ignore[attr-defined]
    _listen_wsgi(
        reactor,
        pool,
        application,
        port,
        access_log_formatter,
        health_check_path,
    )
    _listen_metrics(reactor, metrics_port)

    # Register the metrics collector.
    REGISTRY.register(cast(Collector, TwistedThreadPoolCollector(pool)))

    # Start the main loop.
    reactor.run()  # type: ignore[attr-defined]

    # Clean up when exiting.
    pool.stop()


class JsonFormatter(logging.Formatter):
    def format(self, record):
        log_record = {
            "level": record.levelname,
            "name": record.name,
            "message": record.getMessage(),
        }
        return json.dumps(log_record)


def _listen_wsgi(
        reactor: Any,
        pool: Any,
        application: "WSGIApplication",
        port: int,
        access_log_formatter: LogFormatter,
        health_check_path: str,
) -> None:
    """Listen for the WSGI application."""
    wsgi_resource = WSGIResource(reactor, pool, application)
    wsgi_site = KubernetesWSGISite(
        health_check_path,
        wsgi_resource,
        logFormatter=None,
        timeout=10,
    )
    wsgi_endpoint = TCP4ServerEndpoint(reactor, port)
    wsgi_endpoint.listen(wsgi_site)


def _listen_metrics(reactor: Any, port: int) -> None:
    """Listen for serving Prometheus metrics."""
    metrics_resource = MetricsResource()
    metrics_site = MetricsSite(metrics_resource)
    metrics_endpoint = TCP4ServerEndpoint(reactor, port)
    metrics_endpoint.listen(metrics_site)
