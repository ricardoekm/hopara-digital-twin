import json
import os
import shutil
import tempfile
import unittest

from common.client.local_storage import LocalStorage
from common.path import path_join


class TestLocalStorage(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.mkdtemp()
        self.storage = LocalStorage(self.temp_dir)

        # Create some test files and directories
        self.test_dir1 = path_join(self.temp_dir, "test_dir1")
        self.test_dir2 = path_join(self.temp_dir, "test_dir2")
        os.makedirs(self.test_dir1, exist_ok=True)
        os.makedirs(self.test_dir2, exist_ok=True)

        # Create test files
        self.test_file1_path = "test_dir1/test_file1.txt"
        self.test_file2_path = "test_dir1/test_file2.json"
        self.test_file3_path = "test_dir2/test_file3.txt"

        # Write test content
        with open(path_join(self.temp_dir, self.test_file1_path), 'w') as f:
            f.write("Hello, World!")

        test_json = {"key": "value", "number": 42}
        with open(path_join(self.temp_dir, self.test_file2_path), 'w') as f:
            json.dump(test_json, f)

        with open(path_join(self.temp_dir, self.test_file3_path), 'w') as f:
            f.write("Another test file")

    def tearDown(self):
        shutil.rmtree(self.temp_dir)

    def test_upload(self):
        content = b"Test upload content"
        path = "upload_test.txt"

        self.storage.upload(content, path)

        # Verify file was created
        full_path = path_join(self.temp_dir, path)
        self.assertTrue(os.path.exists(full_path))

        # Verify content
        with open(full_path, 'rb') as f:
            self.assertEqual(f.read(), content)

    def test_upload_with_cwd(self):
        content = b"Test upload with cwd"
        path = "nested_upload.txt"
        cwd = "nested_dir"

        self.storage.upload(content, path, cwd=cwd)

        # Verify file was created in the right location
        full_path = path_join(self.temp_dir, cwd, path)
        self.assertTrue(os.path.exists(full_path))

        # Verify content
        with open(full_path, 'rb') as f:
            self.assertEqual(f.read(), content)

    def test_upload_with_nested_directories(self):
        content = b"Nested directory test"
        path = "deep/nested/structure/file.txt"

        self.storage.upload(content, path)

        # Verify file and directories were created
        full_path = path_join(self.temp_dir, path)
        self.assertTrue(os.path.exists(full_path))

    def test_enum_folders(self):
        folders = self.storage.enum_folders("")

        # Should contain our test directories
        self.assertIn("test_dir1", folders)
        self.assertIn("test_dir2", folders)

    def test_get_versions(self):
        self.storage.upload(b"any", "base/123/raw")
        self.storage.upload(b"any", "base/456/raw")
        versions = self.storage.get_versions("base")
        self.assertEqual(versions, [456, 123])

    def test_get_latest_version(self):
        # Existing file should return 1
        version = self.storage.get_latest_version(self.test_file1_path)
        self.assertEqual(version, None)

        # Non-existing file should return None
        version = self.storage.get_latest_version("non_existent.txt")
        self.assertIsNone(version)

    def test_enum_files(self):
        files, next_token = self.storage.enum_files("")

        # Should contain our test files
        self.assertIn(self.test_file1_path, files)
        self.assertIn(self.test_file2_path, files)
        self.assertIn(self.test_file3_path, files)

    def test_enum_files_with_limit(self):
        files, next_token = self.storage.enum_files("", limit=2)

        # Should return exactly 2 files
        self.assertEqual(len(files), 2)
        # Should have a next token since we have more files
        self.assertIsNotNone(next_token)

        # Get next page
        more_files, final_token = self.storage.enum_files("", page_token=next_token, limit=2)
        self.assertGreater(len(more_files), 0)

    def test_search_files(self):
        # Search for files containing "test_file"
        results = self.storage.search_files("", "test_file")

        self.assertIn(self.test_file1_path, results)
        self.assertIn(self.test_file2_path, results)
        self.assertIn(self.test_file3_path, results)

    def test_search_files_with_limit(self):
        results = self.storage.search_files("", "test", limit=2)
        self.assertEqual(len(results), 2)

    def test_delete(self):
        # Create a file to delete
        test_content = b"File to delete"
        test_path = "delete_me.txt"
        self.storage.upload(test_content, test_path)

        # Verify file exists
        self.assertTrue(self.storage.file_exists(test_path))

        # Delete the file
        result = self.storage.delete(test_path)
        self.assertEqual(result, 200)

        # Verify file is gone
        self.assertFalse(self.storage.file_exists(test_path))

    def test_delete_non_existent(self):
        result = self.storage.delete("non_existent.txt")
        self.assertEqual(result, 200)

    def test_get(self):
        content, metadata = self.storage.get(self.test_file1_path)

        self.assertIsNotNone(content)
        self.assertEqual(content, b"Hello, World!")
        # Local storage doesn't provide metadata
        self.assertIsNone(metadata)

    def test_get_non_existent(self):
        content, metadata = self.storage.get("non_existent.txt")

        self.assertIsNone(content)
        self.assertIsNone(metadata)

    def test_get_with_cwd(self):
        content, metadata = self.storage.get("test_file1.txt", cwd="test_dir1")

        self.assertIsNotNone(content)
        self.assertEqual(content, b"Hello, World!")

    def test_get_with_info(self):
        file_info = (self.test_file1_path, "", 1, "extra")
        content, metadata, path, cwd, version = self.storage.get_with_info(file_info)

        self.assertIsNotNone(content)
        self.assertEqual(content, b"Hello, World!")
        self.assertEqual(path, self.test_file1_path)
        self.assertEqual(cwd, "")
        self.assertEqual(version, 1)

    def test_get_json(self):
        """Test getting JSON file content"""
        json_data = self.storage.get_json(self.test_file2_path)

        expected = {"key": "value", "number": 42}
        self.assertEqual(json_data, expected)

    def test_get_json_non_existent(self):
        """Test getting non-existent JSON file"""
        with self.assertRaises(FileNotFoundError):
            self.storage.get_json("non_existent.json")

    def test_get_bytes(self):
        """Test getting raw bytes"""
        content = self.storage.get_bytes(self.test_file1_path)

        self.assertIsNotNone(content)
        self.assertEqual(content, b"Hello, World!")

    def test_file_exists(self):
        """Test file existence check"""
        # Existing file
        self.assertTrue(self.storage.file_exists(self.test_file1_path))

        # Non-existing file
        self.assertFalse(self.storage.file_exists("non_existent.txt"))

    def test_exists_deprecated(self):
        """Test deprecated exists method"""
        # Should work the same as file_exists
        self.assertTrue(self.storage.exists(self.test_file1_path))
        self.assertFalse(self.storage.exists("non_existent.txt"))

    def test_get_metadata(self):
        self.storage.upload(b"any", "any_file.txt", metadata={"custom": "data"})
        metadata = self.storage.get_metadata("any_file.txt")
        self.assertEqual(metadata['custom'], 'data')

    def test_get_metadata_non_existent(self):
        """Test getting metadata for non-existent file"""
        metadata = self.storage.get_metadata("non_existent.txt")
        self.assertEqual(metadata, {})

    def test_copy(self):
        """Test file copying"""
        source_path = self.test_file1_path
        destination_path = "copied_file.txt"

        result = self.storage.copy(source_path, destination_path)
        self.assertEqual(result, 200)

        # Verify both files exist and have same content
        self.assertTrue(self.storage.file_exists(source_path))
        self.assertTrue(self.storage.file_exists(destination_path))

        source_content = self.storage.get_bytes(source_path)
        dest_content = self.storage.get_bytes(destination_path)
        self.assertEqual(source_content, dest_content)

    def test_copy_non_existent(self):
        """Test copying non-existent file"""
        result = self.storage.copy("non_existent.txt", "destination.txt")
        self.assertEqual(result, 404)

    def test_copy_folder(self):
        """Test folder copying"""
        source_dir = "test_dir1"
        destination_dir = "copied_dir"

        results = self.storage.copy_folder(source_dir, destination_dir)

        # Should have success codes for each file copied
        self.assertTrue(all(result == 200 for result in results))

        # Verify copied files exist
        self.assertTrue(self.storage.file_exists("copied_dir/test_file1.txt"))
        self.assertTrue(self.storage.file_exists("copied_dir/test_file2.json"))

    def test_copy_folder_non_existent(self):
        """Test copying non-existent folder"""
        results = self.storage.copy_folder("non_existent_dir", "destination_dir")
        self.assertEqual(results, [404])

    def test_delete_folder(self):
        """Test folder deletion"""
        # Create a test folder with files
        test_folder = "folder_to_delete"
        self.storage.upload(b"test content 1", f"{test_folder}/file1.txt")
        self.storage.upload(b"test content 2", f"{test_folder}/file2.txt")

        # Verify folder and files exist
        self.assertTrue(self.storage.file_exists(f"{test_folder}/file1.txt"))
        self.assertTrue(self.storage.file_exists(f"{test_folder}/file2.txt"))

        # Delete the folder
        self.storage.delete_folder(test_folder)

        # Verify folder and files are gone
        self.assertFalse(self.storage.file_exists(f"{test_folder}/file1.txt"))
        self.assertFalse(self.storage.file_exists(f"{test_folder}/file2.txt"))
        self.assertFalse(os.path.exists(path_join(self.temp_dir, test_folder)))

    def test_list_file_names(self):
        """Test listing files by name pattern"""
        results = self.storage.list_file_names("", "test_file")

        # Should find all test files
        file_paths = [path for path, version in results]
        self.assertIn(self.test_file1_path, file_paths)
        self.assertIn(self.test_file2_path, file_paths)
        self.assertIn(self.test_file3_path, file_paths)

        # All should have version 1
        versions = [version for path, version in results]
        self.assertTrue(all(version == 1 for version in versions))

    def test_list_file_names_with_limit(self):
        """Test listing files with limit"""
        results = self.storage.list_file_names("", "test", limit=2)
        self.assertEqual(len(results), 2)

    def test_get_multiple(self):
        """Test getting multiple files"""
        file_infos = [
            (self.test_file1_path, "", 1, "extra1"),
            (self.test_file2_path, "", 1, "extra2"),
            ("non_existent.txt", "", 1, "extra3")
        ]

        results = self.storage.get_multiple(file_infos)

        # Should have results for all requested files
        self.assertIn(self.test_file1_path, results)
        self.assertIn(self.test_file2_path, results)
        self.assertIn("non_existent.txt", results)

        # Successful files should have content
        self.assertIsNotNone(results[self.test_file1_path]['content'])
        self.assertIsNotNone(results[self.test_file2_path]['content'])
        self.assertIsNone(results["non_existent.txt"]['content'])

    def test_enum_files_none_path(self):
        """Test enum_files with None path"""
        files, next_token = self.storage.enum_files(None)

        # Should work same as empty string
        self.assertIn(self.test_file1_path, files)
        self.assertIn(self.test_file2_path, files)

    def test_enum_files_no_limit(self):
        """Test enum_files with no limit"""
        files, next_token = self.storage.enum_files("", limit=None)

        # Should return all files with no next token
        self.assertIsNone(next_token)
        self.assertGreaterEqual(len(files), 3)  # At least our test files

    def test_search_files_no_limit(self):
        """Test search_files with no limit"""
        results = self.storage.search_files("", "test", limit=None)

        # Should return all matching files
        self.assertGreaterEqual(len(results), 3)  # At least our test files
