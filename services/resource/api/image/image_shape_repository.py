import json
from typing import Any, Dict, List
from urllib.parse import quote

from api.image.find_closest_polygon import find_closest_polygon
from api.image.image_path import ImagePath
from common.angle import DEFAULT_ANGLE
from common.client.s3_storage import S3Storage
from common.path import path_join
from common.resource_result import ResourceResult


class ImageShapeRepository:
    def __init__(self, storage: S3Storage):
        self.storage = storage

    def _do_read_shape_file(self, path: str) -> Dict[str, Any] | None:
        buffer, _ = self.storage.get(path)
        if not buffer: return None
        shape_json = json.loads(buffer.decode())
        if not isinstance(shape_json, dict) or 'polygon' not in shape_json.keys() or 'bounds' not in shape_json.keys():
            return None
        return shape_json

    def _read_shape_file(self, tenant: str, library: str, name: str, angle: int | None) -> Dict[str, Any] | None:
        version = self.storage.get_latest_version(ImagePath.get_base_dir(tenant, library, name))
        if version is None:
            return None

        # pediu sem angulo
        if not angle:
            shape = self._do_read_shape_file(
                path_join(ImagePath.get_version_dir(tenant, library, name, version), 'shape.json')
            )
            if shape: return shape

            # se pediu sem angulo, mas não existe vamos tentar com angulo
            return self._do_read_shape_file(
                path_join(ImagePath.get_version_dir(tenant, library, name, version), f'shape_{DEFAULT_ANGLE}.json')
            )

        # pediu com angulo
        shape = self._do_read_shape_file(
            path_join(ImagePath.get_version_dir(tenant, library, name, version), f'shape_{angle}.json')
        )
        if shape: return shape

        # se pediu com angulo, mas não achou vamos tentar sem angulo
        return self._do_read_shape_file(
            path_join(ImagePath.get_version_dir(tenant, library, name, version), 'shape.json')
        )

    def get_shape(self, tenant: str, library: str, name: str, angle: int | None) -> Dict[str, Any] | None:
        shape = self._read_shape_file(tenant, library, name, angle)
        if shape:
            return {'shape': shape.get('polygon')}
        return None

    def shape_box(self, tenant: str, library: str, name: str) -> Dict[str, Any] | None:
        shape = self._read_shape_file(tenant, library, name, None)
        if shape:
            return {'shape-box': shape.get('bounds')}
        return None

    def get_closest_room(self, tenant: str, library: str, name: str, polygon: Any) -> Dict[str, List] | None:
        version = self.storage.get_latest_version(ImagePath.get_base_dir(tenant, library, name))
        if version is None:
            return None
        shape_path = path_join(ImagePath.get_version_dir(tenant, library, name, version), 'rooms.json')
        buffer, _ = self.storage.get(shape_path)
        if buffer is None: return None

        shape_json = json.loads(buffer.decode())
        if not shape_json: return None

        rooms = shape_json.get('rooms')
        if not rooms: return None

        room = find_closest_polygon(rooms, polygon)
        if not room: return None
        return {'shape': room}

    def get_library_shapes(self, tenant: str, library: str) -> list[ResourceResult]:
        processed_dir = ImagePath.get_base_dir(tenant, library, '')
        image_names_and_versions = self.storage.list_file_names(processed_dir, 'shape')

        file_paths_and_versions = []
        for file in image_names_and_versions:
            name, version = file
            file_paths_and_versions.append((
                ImagePath.get_file_path(version, 'shape.json'),
                name,
                version,
                ImagePath.get_base_dir(tenant, library, quote(name, safe=''))
            ))

        files_data = self.storage.get_multiple(file_paths_and_versions)
        files = []

        for path in files_data:
            buffer, metadata, name, version = files_data[path]

            if metadata is not None:
                metadata['tenant'] = tenant
                metadata['library'] = library
                metadata['name'] = name
                metadata['version'] = version

            if buffer:
                metadata['shape'] = buffer
                files.append(ResourceResult.success(None, metadata))
        return files
