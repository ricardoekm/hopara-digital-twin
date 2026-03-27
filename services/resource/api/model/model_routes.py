
from dependency_injector.wiring import Provide, inject
from flask import Blueprint, Response, make_response, request

from api.container import Container
from api.image.image import ModelRequestFormat
from api.model.model_service import ModelService
from api.security.security import verify_token
from common.server_util import get_resource_response_with_header

blueprint = Blueprint('model', __name__)


def get_request_format() -> ModelRequestFormat:
    if request.args.get('format') == 'image' or 'image/' in request.headers.get('Accept', ''):
        return 'image'
    elif request.args.get('format') == 'json' or 'application/json' in request.headers.get('Accept', ''):
        return 'json'
    return 'model'


def get_processing_params() -> dict:
    return {
        'compressed-gltf': request.args.get('compressed-gltf', 'true').lower() in ['true', '1', 'yes', 'y'],
        'compression-level': request.args.get('compression-level', 6, type=int),
    }


@blueprint.route("/tenant/<tenant>/model/<path:name>", methods=['PUT'])
@inject
@verify_token
def put(tenant: str, name: str, service: ModelService = Provide[Container.model_service]) -> Response:
    file = request.files['file']
    result = service.save(
        tenant, 'default', name, file.stream.read(), processing_params=get_processing_params(),
    )
    return get_resource_response_with_header(result)


@blueprint.route("/tenant/<tenant>/model-library/<library>/model/<path:name>", methods=['PUT'])
@inject
@verify_token
def library_put(
        tenant: str, library: str, name: str, service: ModelService = Provide[Container.model_service],
) -> Response:
    """
        Upload a 3D model to the model library.
        ---
        tags:
          - model-library
        parameters:
          - name: tenant
            in: path
            required: true
            schema:
              type: string
            description: The tenant ID
          - name: library
            in: path
            required: true
            schema:
              type: string
            description: The name of the library where the model will be saved
          - name: name
            in: path
            required: true
            schema:
              type: string
            description: The name of the model to be saved
          - name: file
            in: formData
            required: true
            schema:
              type: file
            description: The model file to be uploaded. GLB, GLTF, and FBX formats are supported.
        consumes:
          - multipart/form-data
        responses:
          200:
            description: The model upload was successful
            content:
              application/json:
                schema:
                  type: object
                  properties:
                    message:
                      type: string
                      example: "Upload successful"
                    status:
                      type: string
                      example: "success"
          400:
            description: Invalid request, incorrect parameters or missing file
          401:
            description: Authentication failed, invalid or missing token
          500:
            description: Internal server error
        """
    file = request.files['file']
    result = service.save(
        tenant, library, name, file.stream.read(), processing_params=get_processing_params(),
    )
    return get_resource_response_with_header(result)


@blueprint.route("/tenant/<tenant>/model-library/<library>/model/<path:name>", methods=['GET'])
@inject
def library_get(
        tenant: str, library: str, name: str, service: ModelService = Provide[Container.model_service],
) -> Response:
    """
       Retrieve a 3D model or its metadata from the model library.
       ---
       tags:
         - model-library
       parameters:
         - name: tenant
           in: path
           required: true
           schema:
             type: string
           description: The tenant ID
         - name: library
           in: path
           required: true
           schema:
             type: string
           description: The name of the model library
         - name: name
           in: path
           required: true
           schema:
             type: string
           description: The name of the model to be retrieved
         - name: fallback
           in: query
           required: false
           schema:
             type: string
           description: Fallback path to an alternative model if the original is not found.
            The fallback must be in the same library.
         - name: format
           in: query
           required: false
           schema:
             type: string
           description: If 'json', returns only the model metadata instead of the model.
            This is a way to check if the model exists without downloading it.
       responses:
         200:
           description: The model was successfully retrieved
           content:
             application/octet-stream:
               schema:
                 type: string
                 format: binary
         400:
           description: Invalid request, incorrect parameters
         404:
           description: Model not found
         500:
           description: Internal server error
       """

    fallback = request.args.get('fallback', None)
    result = service.get(tenant, library, name, get_request_format(), fallback)
    return get_resource_response_with_header(result)


@blueprint.route("/tenant/<tenant>/model-library/<library>/model/<path:name>/history", methods=['GET'])
@inject
def history_list(
        tenant: str, library: str, name: str, service: ModelService = Provide[Container.model_service],
) -> Response:
    limit = request.args.get('limit', type=int)
    items = service.history_list(tenant, library, name, limit)
    return make_response(items)


@blueprint.route("/tenant/<tenant>/model-library/<library>/model/<path:name>/history/<version>", methods=['GET'])
@inject
def history_checkout(
        tenant: str, library: str, name: str, version: int, service: ModelService = Provide[Container.model_service],
) -> Response:
    resource = service.history_checkout(tenant, library, name, int(version), get_request_format())
    return get_resource_response_with_header(resource)


@blueprint.route(
    "/tenant/<tenant>/model-library/<library>/model/<path:name>/history/<version>/restore",
    methods=['PUT'],
)
@inject
def history_restore(
        tenant: str, library: str, name: str, version: int, service: ModelService = Provide[Container.model_service],
) -> Response:
    resource = service.history_restore(tenant, library, name, int(version))
    return get_resource_response_with_header(resource)


@blueprint.route(
    "/tenant/<tenant>/model-library/<library>/model/<path:name>/history/<version>/rollback",
    methods=['PUT'],
)
@inject
def history_rollback(
        tenant: str, library: str, name: str, version: str, service: ModelService = Provide[Container.model_service],
) -> Response:
    resource = service.history_undo(tenant, library, name, int(version))
    return get_resource_response_with_header(resource)
