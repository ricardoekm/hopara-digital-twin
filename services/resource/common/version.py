from datetime import datetime
from typing import Any, Dict, List, Tuple, cast


class VersionFactory:
    def create(self) -> int:
        return int(datetime.now().timestamp())

    def get_version(
            self, versions: List[int], path: str, requested_version: int
    ) -> Tuple[dict[str, str], str, int, int]:
        if not versions:
            raise ValueError('No versions found')
        version = 0
        if str(requested_version) in versions:
            version = requested_version
        elif requested_version != 0:
            versions_before_timestamp = list(filter(lambda v: int(v) <= int(requested_version), versions))
            if versions_before_timestamp:
                version = versions_before_timestamp[0]

        new_version = self.create()
        new_metadata = {'version': str(new_version), 'restored-from': str(version)}
        empty_path = f'{path}/{new_version}/empty'
        return new_metadata, empty_path, version, new_version


def list_history_items(versions: List[int], limit: int | None) -> List[Dict[str, Any]]:
    versions_dict = [{
        'version': version,
        'updatedAt': datetime.fromtimestamp(int(version)),
    } for version in versions]

    before_oldest_version: int = int(
        datetime.now().timestamp(),
    )  # Se não tem versão, vamos usar agora para versão 0
    if len(versions_dict):
        v = int(cast(str, versions_dict[-1].get('version')))
        before_oldest_version = v - 60
    versions_dict.append(
        {
            'version': 0,
            'updatedAt': datetime.fromtimestamp(before_oldest_version),
        },
    )
    if limit:
        versions_dict = versions_dict[:limit]
    return versions_dict
