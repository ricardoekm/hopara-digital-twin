import json
import os
from typing import Any, Dict, List, Optional, Tuple

from common.client.storage import Storage
from common.path import path_join


class LocalStorage(Storage):
    def __init__(self, base_path: str | None) -> None:
        self.base_path = base_path

    def upload(self, buffer: bytes, path: str, metadata: Optional[Dict] = None, cwd: str = '') -> None:
        full_path = path_join(self.base_path, cwd, path) if cwd else path_join(self.base_path, path.lstrip('/'))
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, 'wb') as f:
            f.write(buffer)
        with open(full_path + '.metadata', 'wb') as f:
            f.write(json.dumps(metadata or {}).encode('utf-8'))

    def enum_folders(self, path: str, fast_mode: bool = False) -> List[str]:
        full_path = path_join(self.base_path, path)
        if fast_mode:
            if not os.path.isdir(full_path):
                return []
            return sorted([
                path_join(path, entry)
                for entry in os.listdir(full_path)
                if os.path.isdir(os.path.join(full_path, entry))
            ])

        folders = set()
        for root, dirs, files in os.walk(full_path):
            for file in files:
                folders.add(os.path.dirname(os.path.relpath(path_join(root, file), self.base_path)))
        return sorted(folders)

    def get_versions(self, path: str) -> List[int]:
        folders = self.enum_folders(path)
        folders = [folder.replace(path, '').strip('/') for folder in folders]
        versions = [int(folder) for folder in folders if isinstance(folder, str) and folder.isdigit()]
        return sorted(versions, reverse=True)

    def get_latest_version(self, path: str) -> Optional[int]:
        versions = self.get_versions(path)
        if versions:
            return int(versions[0])  # mais recente
        return None

    def enum_files(self, path: Optional[str], page_token: Optional[str] = None, limit: Optional[int] = 100) -> Tuple[
        List[str], Optional[str]]:
        if path is None:
            path = ""
        full_path = path_join(self.base_path, path)
        file_paths = []
        for root, dirs, files in os.walk(full_path):
            for file in files:
                file_paths.append(os.path.relpath(path_join(root, file), self.base_path))
        file_paths = sorted(file_paths)
        file_paths = [f for f in file_paths if not f.endswith('.metadata')]

        # Simple pagination implementation
        start_idx = 0
        if page_token:
            try:
                start_idx = int(page_token)
            except ValueError:
                start_idx = 0

        if limit is not None:
            end_idx = start_idx + limit
            paginated_files = file_paths[start_idx:end_idx]
            next_token = str(end_idx) if end_idx < len(file_paths) else None
        else:
            paginated_files = file_paths[start_idx:]
            next_token = None

        # filter not metadata
        return paginated_files, next_token

    def search_files(self, path: str, query: str, limit: Optional[int] = 100) -> List[str]:
        full_path = path_join(self.base_path, path)
        matching_files = []
        for root, dirs, files in os.walk(full_path):
            for file in files:
                if query.lower() in file.lower():
                    matching_files.append(os.path.relpath(path_join(root, file), self.base_path))

        # replace path in the beginning of matched_paths with empty string
        matching_files = [mp.replace(path, '') for mp in matching_files]
        matching_files = [f for f in matching_files if not f.endswith('.metadata')]
        matching_files = sorted(matching_files)
        return matching_files[:limit] if limit is not None else matching_files

    def delete(self, path: str, cwd: str = '') -> int:
        full_path = path_join(self.base_path, cwd, path) if cwd else path_join(self.base_path, path)
        try:
            if os.path.exists(full_path):
                os.remove(full_path)
            if os.path.exists(full_path + '.metadata'):
                os.remove(full_path + '.metadata')
        except OSError:
            return 500
        return 200  # Success

    def get(self, path: str, cwd: str = '') -> Tuple[Optional[bytes], Optional[dict]]:
        full_path = path_join(self.base_path, cwd, path) if cwd else path_join(self.base_path, path)
        content = None
        metadata = None
        if os.path.exists(full_path):
            with open(full_path, 'rb') as f:
                content = f.read()
        if os.path.exists(full_path + '.metadata'):
            with open(full_path + '.metadata', 'rb') as f:
                metadata = json.loads(f.read().decode('utf-8'))
        return content, metadata

    def get_with_info(self, file_info: Tuple[str, str, int, str]) -> Tuple[
        Optional[bytes], Optional[dict], str, str, int]:
        path, cwd, version, extra = file_info
        content, metadata = self.get(path, cwd)
        return content, metadata, path, cwd, version

    def get_json(self, path: str, cwd: str = '') -> dict:
        content, _ = self.get(path, cwd)
        if content is None:
            raise FileNotFoundError(f'File not found: {path}')
        return json.loads(content.decode('utf-8'))

    def get_bytes(self, path: str, cwd: str = '') -> Optional[bytes]:
        content, _ = self.get(path, cwd)
        return content

    def file_exists(self, path: str, cwd: str = '') -> bool:
        full_path = path_join(self.base_path, cwd, path) if cwd else path_join(self.base_path, path)
        return os.path.exists(full_path)

    def get_metadata(self, path: str, cwd: str = '') -> dict:
        full_path = path_join(self.base_path, cwd, path) if cwd else path_join(self.base_path, path)
        if os.path.exists(full_path + '.metadata'):
            with open(full_path + '.metadata', 'rb') as f:
                return json.loads(f.read().decode('utf-8'))
        return {}

    # Rename exists method to file_exists to match interface
    def exists(self, path: str) -> bool:
        """Deprecated: use file_exists instead"""
        return self.file_exists(path)

    def copy(self, source_path: str, destination_path: str, metadata: Optional[dict] = None) -> int:
        full_source_path = path_join(self.base_path, source_path)
        full_destination_path = path_join(self.base_path, destination_path)
        if os.path.exists(full_source_path):
            os.makedirs(os.path.dirname(full_destination_path), exist_ok=True)
            with open(full_source_path, 'rb') as src_file:
                with open(full_destination_path, 'wb') as dest_file:
                    dest_file.write(src_file.read())
            if metadata is not None:
                with open(full_destination_path + '.metadata', 'wb') as f:
                    f.write(json.dumps(metadata).encode('utf-8'))
            return 200  # Success
        return 404  # Not found

    def copy_folder(self, source_dir: str, destination_dir: str, new_metadata: Optional[dict] = None) -> List[int]:
        source_dir_full = path_join(self.base_path, source_dir)
        results = []

        if os.path.exists(source_dir_full):
            for root, dirs, files in os.walk(source_dir_full):
                for file in files:
                    rel_dir = os.path.relpath(root, source_dir_full)
                    source_file_path = path_join(source_dir, rel_dir, file) if rel_dir != '.' else path_join(
                        source_dir, file)
                    dest_file_path = path_join(destination_dir, rel_dir, file) if rel_dir != '.' else path_join(
                        destination_dir, file)
                    result = self.copy(source_file_path, dest_file_path, new_metadata)
                    results.append(result)
        else:
            results.append(404)  # Source directory not found

        return results

    def delete_folder(self, path: str) -> None:
        full_path = path_join(self.base_path, path)
        if os.path.exists(full_path):
            for root, dirs, files in os.walk(full_path, topdown=False):
                for file in files:
                    os.remove(path_join(root, file))
                for dir in dirs:
                    os.rmdir(path_join(root, dir))
            os.rmdir(full_path)

    def list_file_names(self, base_path: str, file_name: str, limit: Optional[int] = 100) -> List[Tuple[str, int]]:
        full_path = path_join(self.base_path, base_path)
        matching_files = []

        for root, dirs, files in os.walk(full_path):
            for file in files:
                if file_name in file:
                    rel_path = os.path.relpath(path_join(root, file), self.base_path)
                    matching_files.append((rel_path, 1))  # Version 1 for local storage

        matching_files = sorted(matching_files)
        return matching_files[:limit] if limit is not None else matching_files

    def get_multiple(self, file_infos: List[Tuple[str, str, int, str]]) -> Dict[str, Any]:
        results = {}
        for file_info in file_infos:
            path, cwd, version, extra = file_info
            try:
                content, metadata, ret_path, ret_cwd, ret_version = self.get_with_info(file_info)
                results[path] = {
                    'content': content,
                    'metadata': metadata,
                    'path': ret_path,
                    'cwd': ret_cwd,
                    'version': ret_version
                }
            except Exception as e:
                results[path] = {'error': str(e)}
        return results
