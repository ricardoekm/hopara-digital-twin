import logging
from typing import Any

import cv2
import numpy as np
from numpy import dtype, ndarray
from shapely.errors import GEOSException
from shapely.geometry import MultiPolygon, Polygon
from shapely.geometry.base import BaseGeometry
from shapely.ops import unary_union

from consumer.image.margin_cropper import get_margin_crop_area


def remove_background(image):
    try:
        from rembg import remove  # lazy import: avoids ~250s numba JIT at startup
        return remove(image, post_process_mask=True)
    except Exception as error:
        logging.exception(f"Error getting image polygon: {error}")
    return image


def polygon_to_array(polygon: Polygon | BaseGeometry, height: int, width: int) -> ndarray[Any, dtype[Any]]:
    arr = np.array(list(map(list, polygon.exterior.coords)))  # type: ignore
    arr[:, 0] = arr[:, 0] / width
    arr[:, 1] = arr[:, 1] / height
    return arr * 100


def get_image_polygon(buffer: bytes) -> tuple[ndarray[Any, dtype[Any]], ndarray[Any, dtype[Any]]]:
    np_arr = np.frombuffer(buffer, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_UNCHANGED)

    # Handle case where image decoding fails
    if image is None:
        # Return empty polygons if image cannot be decoded
        return np.array([]), np.array([])

    cropped_image = get_margin_crop_area(image)
    if cropped_image is not None:
        x, y, w, h = cropped_image
        image = image[y:y + h, x:x + w]

    if image.shape[2] != 4:  # Nao tem canal alfa, vamos tentar remover fundo e ver se gera
        image = remove_background(image)
        # Handle case where remove_background might return None
        if image is None:
            return np.array([]), np.array([])
        if image.shape[2] != 4:
            height, width = image.shape[:2]
            bounding_box = Polygon([(0, 0), (width, 0), (width, height), (0, height), (0, 0)])
            return polygon_to_array(bounding_box, height, width), np.array([])

    alpha_channel = image[:, :, 3]
    # Criar uma máscara binária (0: transparente, 255: opaco)
    _, mask = cv2.threshold(alpha_channel, 0, 255, cv2.THRESH_BINARY)
    # Se tudo é opaco, mesmo que exista canal alpha, a imagem não tem transparencia.
    if not (mask < 255).any():
        image = remove_background(image)
        # Handle case where remove_background might return None
        if image is None:
            return np.array([]), np.array([])
        alpha_channel = image[:, :, 3]
        _, mask = cv2.threshold(alpha_channel, 0, 255, cv2.THRESH_BINARY)

    height, width = image.shape[:2]
    # Encontrar os contornos na máscara
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    # Criar uma lista de polígonos Shapely a partir dos contornos
    multi_polygons = MultiPolygon([Polygon(contour.reshape(-1, 2)) for contour in contours if len(contour) >= 4])
    # Unir os polígonos usando Shapely (unary_union)
    try:
        unified_polygon = unary_union(multi_polygons)
    except GEOSException:
        unified_polygon = multi_polygons.convex_hull

    if unified_polygon.geom_type == 'MultiPolygon':
        areas = [p.area for p in unified_polygon.geoms]
        max_area = max(areas)
        filtered_polygons = [p for p in unified_polygon.geoms if p.area >= 0.1 * max_area]
        unified_polygon = unary_union(filtered_polygons)

    if unified_polygon.geom_type == 'MultiPolygon':
        unified_polygon = unified_polygon.convex_hull

    simplified_polygon = unified_polygon.simplify(tolerance=5, preserve_topology=True)
    return polygon_to_array(simplified_polygon, height, width), polygon_to_array(simplified_polygon.envelope, height,
                                                                                 width)
