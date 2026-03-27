from dependency_injector.wiring import Provide, inject
from flask import Blueprint, Response, jsonify, make_response, request

from api.container import Container
from api.icon.icon_service import IconService
from api.security.security import verify_token
from common.dictionary import get_bool
from common.resource_state import ResourceState
from common.server_util import get_icon_response_with_header, get_response

blueprint = Blueprint('icon', __name__)

TEMPORARY_ICON_TTL = 900  # 15 minutes


@blueprint.route("/tenant/<tenant>/icon-library/<library>/icon/<path:name>", methods=['PUT'])
@inject
@verify_token
def put(tenant: str, library: str, name: str, service: IconService = Provide[Container.icon_service]) -> Response:
    """
        Upload an icon to the icon library.
        ---
        tags:
          - icon-library
        parameters:
          - name: tenant
            in: path
            type: string
            required: true
            description: The tenant ID
          - name: library
            in: path
            type: string
            required: true
            description: The name of the library where the icon will be saved
          - name: name
            in: path
            type: string
            required: true
            description: The name of the icon
          - name: file
            in: formData
            type: file
            required: true
            description: The icon file to be uploaded
        consumes:
          - multipart/form-data
        responses:
          200:
            description: The icon upload was successful and returns its dimensions
            schema:
              type: object
              properties:
                dimensions:
                  type: object
                  properties:
                    width:
                      type: integer
                      description: Icon width
                    height:
                      type: integer
                      description: Icon height
          500:
            description: Internal server error
            schema:
              type: object
              properties:
                message:
                  type: string
                  example: "Internal server error"
        """
    file = request.files['file']
    buffer = file.stream.read()
    result = service.save(tenant, library, name, buffer)
    return get_icon_response_with_header(result)


@blueprint.route("/tenant/<tenant>/icon/<path:name>", methods=['GET'])
@inject
def find(tenant: str, name: str, service: IconService = Provide[Container.icon_service]) -> Response:
    smart_search = get_bool(request.args, 'smart-search', True)
    result = service.find(tenant, name, request.args.get('fallback', None), smart_search)
    return get_icon_response_with_header(result, TEMPORARY_ICON_TTL)


@blueprint.route("/tenant/<tenant>/icon-library", methods=['GET'])
@inject
def list_libraries(tenant: str, service: IconService = Provide[Container.icon_service]) -> Response:
    return make_response(jsonify(list(library.__json__() for library in service.list_libraries(tenant))), 200)


@blueprint.route("/tenant/<tenant>/icon-library/<library>", methods=['GET'])
@inject
def get_library(tenant: str, library: str, service: IconService = Provide[Container.icon_service]) -> Response:
    library_obj = service.get_library(tenant, library)
    if library_obj:
        return make_response(jsonify(library_obj.__json__()), 200)
    return make_response({'message': f'{library} not found!'}, 404)


@blueprint.route("/tenant/<tenant>/icon-library/<library>/icon", methods=['GET'])
@inject
def list_icons(tenant: str, library: str, service: IconService = Provide[Container.icon_service]) -> Response:
    page_token = request.args.get('page_token', '')
    limit = request.args.get('limit', 100, type=int)
    query = request.args.get('query', '', type=str)
    icons, next_page_token = service.list_from_library(tenant, library, page_token, limit, query)

    if not icons and library not in [library.name for library in service.list_libraries(tenant)]:
        return make_response({'message': 'Library or/and icons not found!'}, 404)

    response = make_response(jsonify(icons), 200)
    if next_page_token:
        response.headers.set('next-page-token', next_page_token)
    return response


@blueprint.route("/tenant/<tenant>/icon", methods=['GET'])
@inject
def list_icons_all_libraries(tenant: str, service: IconService = Provide[Container.icon_service]) -> Response:
    limit = request.args.get('limit', 50, type=int)
    query = request.args.get('query', '', type=str)
    icons = service.list_all(tenant, query, limit)
    response = make_response(jsonify(icons), 200)
    return response


@blueprint.route("/tenant/<tenant>/icon-library/<library>/icon/<path:name>", methods=['GET'])
@inject
def get(tenant: str, library: str, name: str, service: IconService = Provide[Container.icon_service]) -> Response:
    result = service.get(tenant, library, name)
    return get_icon_response_with_header(result)


@blueprint.route("/tenant/<tenant>/icon-library/<library>/icon/<path:name>", methods=['DELETE'])
@inject
@verify_token
def delete(
        tenant: str, library: str, name: str, service: IconService = Provide[Container.icon_service],
) -> Response:
    state = service.delete(tenant, library, name)
    if state == ResourceState.SUCCESS:
        status_code = 200
    else:
        status_code = 500
    return get_response(status_code)
