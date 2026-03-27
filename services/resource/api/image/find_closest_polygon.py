from typing import Any, List

from shapely.geometry import Polygon


def find_closest_polygon(polygons: List[Any], user_polygon: Any) -> list | None:
    intersections = []  # polygon, intersection area, % polygon, % user polygon
    polygons = [Polygon(p) for p in polygons]
    user_polygon = Polygon(user_polygon)
    for p in polygons:
        intersection = user_polygon.intersection(p)
        if intersection.is_valid and not intersection.is_empty:
            intersections.append(
                (
                    p, intersection.area,
                    intersection.area / p.area,
                    intersection.area / user_polygon.area,
                ),
            )
    if len(intersections) == 0:
        return None

    intersections = sorted(intersections, key=lambda intersection: (intersection[2] * intersection[3]), reverse=True)
    return list(intersections[0][0].exterior.coords)
