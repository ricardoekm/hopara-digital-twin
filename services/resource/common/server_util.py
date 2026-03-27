import argparse
import logging
import os
import traceback
from time import time
from typing import Any, Dict, Sequence, Text

from flask import Response, jsonify, make_response, request
from typing_extensions import Optional

from common.mimetype import discover_mimetype
from common.resource_result import ResourceResult
from common.resource_state import ResourceState


def safe_serialize(obj1, max_depth=2):
    max_level = max_depth

    def _safe_serialize(obj, current_level=0):

        nonlocal max_level

        # If it is a list
        if isinstance(obj, list):
            if current_level >= max_level:
                return "[...]"
            result = list()
            for element in obj:
                result.append(_safe_serialize(element, current_level + 1))
            return result

        # If it is a dict
        elif isinstance(obj, dict):
            if current_level >= max_level:
                return "{...}"
            result = dict()
            for key, value in obj.items():
                result[f"{_safe_serialize(key, current_level + 1)}"] = _safe_serialize(value, current_level + 1)
            return result

        # If it is an object of builtin class
        elif hasattr(obj, "__dict__"):
            if hasattr(obj, "__repr__"):
                result = f"{obj.__repr__()}_{int(time())}"
            else:
                try:
                    result = f"{obj.__class__.__name__}_object_{int(time())}"
                except Exception:
                    result = f"object_{int(time())}"
            return result

        # If it is anything else
        else:
            return obj

    return _safe_serialize(obj1)


def get_resource_response_with_header(
        result: ResourceResult
) -> Response:
    # todo: bacalhau para conformidade com o front
    if not result.metadata:
        result.metadata = {}
    result.metadata['dimensions'] = {
        'width': int(result.metadata.get('width', 0)),
        'height': int(result.metadata.get('height', 0)),
    }
    # fim do bacalhau

    if result.state == ResourceState.NOT_FOUND:
        return make_response({'message': 'resource not found!'}, 404)

    if result.state == ResourceState.ERROR:
        return make_response({'message': 'resource error!'}, 500)

    if result.state == ResourceState.PROCESSING:
        response = make_response(result.buffer or '', 202)
        if result.version:
            response.headers.set('Resource-Version', result.version)
        mimetype = discover_mimetype(result.buffer) if result.buffer else 'application/json'
        if mimetype != 'application/json':
            response.headers.set('Resource-Long-Processing', "true")
        response.headers.set('Cache-Control', f's-maxage={300}')  # 5 minutos de cache caso exista
        response.headers.set('Content-Type', mimetype)
        response.headers.set('Content-Disposition', 'attachment')
        return response

    if not result.buffer:
        response = make_response(result.metadata)
        if result.version:
            response.headers.set('Resource-Version', result.version)
        return response

    response = make_response(result.buffer, 200)
    if result.version:
        response.headers.set('Resource-Version', result.version)
    response.headers.set('Content-Type', discover_mimetype(result.buffer))
    response.headers.set('Content-Disposition', 'attachment')
    response.headers.set('Resource-Library', result.metadata.get('library', None))
    response.headers.set('Resource-Name', result.metadata.get('name', ''))
    response.headers.set('Resource-Version', result.metadata.get('version', ''))

    return response


def get_icon_response_with_header(
        result: ResourceResult, s_max_age: Optional[int] = None,
) -> Response:
    response = get_resource_response_with_header(result)
    # Add cache control for temporary smart search icons
    metadata = result.metadata
    if metadata.get('temporary', False) and s_max_age:
        response.headers.set('Cache-Control', f's-maxage={s_max_age}')
    name = result.metadata.get('name', '')
    response.headers.set('Content-Disposition', f'attachment filename="{name}"')
    return response


def get_response(status_code: int) -> Response:
    return make_response('', status_code)


def parse_args(argv: Sequence[Text]) -> Dict[str, Any]:
    parser = argparse.ArgumentParser(
        description="Start a web server",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=2022,
        help="port to run the web application on",
    )
    parser.add_argument(
        "--metrics-port",
        metavar="PORT",
        type=int,
        default=9000,
        help="port to run the Prometheus metrics on",
    )
    args = parser.parse_args(argv)
    return {
        "port": args.port,
        "metrics_port": args.metrics_port,
    }


def handle_exception(error):
    status_code = 500
    if hasattr(error, 'code'):
        status_code = error.code
    response = make_response(jsonify({'message': f'{error=}'}), status_code)
    tb = traceback.extract_tb(error.__traceback__)
    error_details = None
    if tb:
        frame = tb[-1]
        project_base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        for curr_frame in reversed(tb):
            if curr_frame.filename.startswith(project_base_dir):
                frame = curr_frame
                break
        error_details = f'{frame.filename}->{frame.name}({frame.lineno})'
        response.headers['Error-Details'] = error_details
    logging.error(f'{error_details=} | {error=}')
    return response


def get_bool_arg(name: str, default: bool = False) -> bool:
    return request.args.get(name, 'true' if default else 'false', type=str).lower() == 'true'


def get_format() -> str:
    if request.args.get('format') == 'json' or request.headers.get('Accept') == 'application/json':
        return 'metadata'
    if request.args.get('format') == 'image' or 'image/' in request.headers.get('Accept', ''):
        return 'image'
    return 'resource'
