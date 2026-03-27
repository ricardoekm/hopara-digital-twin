import os.path
from typing import List

from common.crop import CropArea
from common.path import path_join
from common.process_resource_event import ResourceStep
from common.resolution import Resolution, ResolutionType


def create_image_to_shape_step(
        cwd: str, origin: str, angle: int | None, invalidation_urls: List[str]
) -> ResourceStep:
    angle_str = f'_{angle}' if angle is not None else ''
    base_path = os.path.dirname(origin)
    return ResourceStep(
        cwd=cwd,
        type='image_to_shape',
        data={
            "origin": origin,
            "destination": path_join(base_path, f'shape{angle_str}.json'),
        },
        invalidation_urls=invalidation_urls
    )


def create_images_to_shapes_steps(cwd: str, origins: List[str], angles: List[int],
                                  invalidation_urls: List[str]) -> List[ResourceStep]:
    steps = []
    for index in range(len(angles)):
        steps.append(create_image_to_shape_step(cwd, origins[index], angles[index], invalidation_urls))
    return steps


def create_image_to_rooms_message(cwd: str, origin: str, invalidation_urls: List[str]) -> ResourceStep:
    dir_name = os.path.dirname(origin)
    return ResourceStep(
        cwd=cwd,
        type='image_to_rooms',
        data={
            "origin": origin,
            "destination": path_join(dir_name, 'rooms.json'),
        },
        invalidation_urls=invalidation_urls
    )


def create_image_to_polygon_messages(
        cwd: str, origin: str, invalidation_urls: List[str]
) -> List[ResourceStep]:
    return [
        create_image_to_shape_step(cwd, origin, None, invalidation_urls),
        create_image_to_rooms_message(cwd, origin, invalidation_urls)
    ]


def create_resize_image_to_default_size_message(
        cwd: str, origin: str, destination: str, invalidation_urls: List[str]
) -> ResourceStep:
    return ResourceStep(
        cwd=cwd,
        type='image_resize',
        data={
            'origin': origin,
            'destination': destination,
            'max_size': Resolution.default_size(),
        },
        invalidation_urls=invalidation_urls,
        ready=True,
    )


def create_resize_image_to_resolutions_steps(
        cwd: str, origin: str, invalidation_urls: List[str], resolutions: List[ResolutionType],
        angle: int | None = None
) -> List[ResourceStep]:
    steps: List[ResourceStep] = []
    index_str = f'_{angle}' if angle is not None else ''
    dir_name = os.path.dirname(origin)
    for resolution in resolutions:
        size = Resolution.get_size(resolution)
        steps.append({
            'cwd': cwd,
            'type': 'image_resize',
            "data": {
                'origin': origin,
                'destination': path_join(dir_name, f'{size}{index_str}.webp'),
                'max_size': size,
            }, 'invalidation_urls': invalidation_urls,
        })
    return steps


def create_crop_image_step(
        cwd: str, origin: str, destination: str, crop_area: CropArea
) -> ResourceStep:
    return ResourceStep(
        cwd=cwd,
        type='image_crop',
        data={
            'origin': origin,
            'destination': destination,
            'crop_area': crop_area,
        },
        ready=True
    )


def create_copy_message(cwd: str, origin: str, destination: str) -> ResourceStep:
    return ResourceStep(
        cwd=cwd,
        type='copy',
        data={
            "origin": origin,
            "destination": destination,
        }
    )
