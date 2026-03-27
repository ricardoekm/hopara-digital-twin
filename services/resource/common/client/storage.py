from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional, Tuple


class Storage(ABC):
    @abstractmethod
    def upload(self, buffer: bytes, path: str, metadata: Dict | None = None, cwd: str = '') -> None:
        """Upload a file to storage"""
        pass

    @abstractmethod
    def enum_folders(self, path: str, fast_mode: bool = False) -> List[str]:
        """Enumerate folders in the given path"""
        pass

    @abstractmethod
    def get_versions(self, path: str) -> List[int]:
        """Get available versions for a path"""
        pass

    @abstractmethod
    def get_latest_version(self, path: str) -> int | None:
        """Get the latest version number for a path"""
        pass

    @abstractmethod
    def enum_files(self, path: str | None, page_token: Optional[str] = None, limit: Optional[int] = 100) -> Tuple[
        List[str], str | None]:
        """Enumerate files with optional pagination"""
        pass

    @abstractmethod
    def search_files(self, path: str, query: str, limit: Optional[int] = 100) -> List[str]:
        """Search files by query pattern"""
        pass

    @abstractmethod
    def delete(self, path: str, cwd: str = '') -> int:
        """Delete a file and return status code"""
        pass

    @abstractmethod
    def get(self, path: str, cwd: str = '') -> Tuple[bytes | None, dict | None]:
        """Get file content and metadata"""
        pass

    @abstractmethod
    def get_with_info(self, file_info: Tuple[str, str, int, str]) -> Tuple[bytes | None, dict | None, str, str, int]:
        """Get file with additional info"""
        pass

    @abstractmethod
    def get_json(self, path: str, cwd: str = '') -> dict:
        """Get file content as JSON"""
        pass

    @abstractmethod
    def get_bytes(self, path: str, cwd: str = '') -> bytes | None:
        """Get raw file bytes"""
        pass

    @abstractmethod
    def file_exists(self, path: str, cwd: str = '') -> bool:
        """Check if file exists"""
        pass

    @abstractmethod
    def get_metadata(self, path: str, cwd: str = '') -> dict:
        """Get file metadata"""
        pass

    @abstractmethod
    def copy(self, source_path: str, destination_path: str, metadata: dict | None = None) -> int:
        """Copy file and return status code"""
        pass

    @abstractmethod
    def copy_folder(self, source_dir: str, destination_dir: str, new_metadata: dict | None = None) -> List[int]:
        """Copy entire folder"""
        pass

    @abstractmethod
    def delete_folder(self, path: str) -> None:
        """Delete entire folder"""
        pass

    @abstractmethod
    def list_file_names(self, base_path: str, file_name: str, limit: Optional[int] = 100) -> List[Tuple[str, int]]:
        """List file names with versions"""
        pass

    @abstractmethod
    def get_multiple(self, file_infos: List[Tuple[str, str, int, str]]) -> Dict[str, Any]:
        """Get multiple files concurrently"""
        pass
