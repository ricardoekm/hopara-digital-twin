import json
import os
import uuid
from unittest import TestCase

from common.client.s3_storage import S3Storage


class TestS3Storage(TestCase):
    @classmethod
    def setUpClass(cls):
        endpoint = 'http://localstack:4566' if os.environ.get('CI') else 'http://localhost:4566'
        cls.bucket_name = f'test-bucket-{uuid.uuid4().hex[:8]}'
        cls.storage = S3Storage(cls.bucket_name, endpoint=endpoint)

    def setUp(self):
        self._cleanup_bucket()

    def tearDown(self):
        self._cleanup_bucket()

    def _cleanup_bucket(self):
        try:
            files, _ = self.storage.enum_files('')
            for file_path in files:
                self.storage.delete(file_path)
        except Exception:
            pass  # Ignore cleanup errors

    def test_upload_and_get_file(self):
        test_path = 'test/file.txt'
        test_content = b'Hello, World!'
        test_metadata = {'author': 'test', 'version': '1.0'}

        # Upload file
        self.storage.upload(test_content, test_path, test_metadata)

        # Retrieve file
        content, metadata = self.storage.get(test_path)

        self.assertEqual(content, test_content)
        self.assertEqual(metadata['author'], 'test')
        self.assertEqual(metadata['version'], '1.0')

    def test_upload_with_cwd(self):
        cwd = 'workspace'
        test_path = 'file.txt'
        test_content = b'Content with CWD'

        self.storage.upload(test_content, test_path, cwd=cwd)

        # File should be accessible with full path
        content, _ = self.storage.get(test_path, cwd=cwd)
        self.assertEqual(content, test_content)

    def test_file_exists(self):
        test_path = 'test/exists.txt'

        # File should not exist initially
        self.assertFalse(self.storage.file_exists(test_path))

        # Upload file
        self.storage.upload(b'test content', test_path)

        # File should exist now
        self.assertTrue(self.storage.file_exists(test_path))

    def test_get_nonexistent_file(self):
        content, metadata = self.storage.get('nonexistent/file.txt')
        self.assertIsNone(content)
        self.assertIsNone(metadata)

    def test_get_bytes(self):
        test_path = 'test/bytes.bin'
        test_content = b'\x00\x01\x02\x03\xff'

        self.storage.upload(test_content, test_path)

        content = self.storage.get_bytes(test_path)
        self.assertEqual(content, test_content)

    def test_get_bytes_nonexistent(self):
        content = self.storage.get_bytes('nonexistent.bin')
        self.assertIsNone(content)

    def test_get_json(self):
        test_path = 'test/data.json'
        test_data = {'key': 'value', 'number': 42, 'array': [1, 2, 3]}
        test_content = json.dumps(test_data).encode('utf-8')

        self.storage.upload(test_content, test_path)

        retrieved_data = self.storage.get_json(test_path)
        self.assertEqual(retrieved_data, test_data)

    def test_get_json_nonexistent(self):
        data = self.storage.get_json('nonexistent.json')
        self.assertEqual(data, {})

    def test_get_json_invalid(self):
        test_path = 'test/invalid.json'
        invalid_json = b'{ invalid json }'

        self.storage.upload(invalid_json, test_path)

        data = self.storage.get_json(test_path)
        self.assertEqual(data, {})

    def test_delete_file(self):
        test_path = 'test/delete_me.txt'

        # Upload file
        self.storage.upload(b'delete me', test_path)
        self.assertTrue(self.storage.file_exists(test_path))

        # Delete file
        status_code = self.storage.delete(test_path)
        self.assertEqual(status_code, 204)  # S3 delete success status
        self.assertFalse(self.storage.file_exists(test_path))

    def test_get_metadata(self):
        test_path = 'test/metadata.txt'
        test_metadata = {'key1': 'value1', 'key2': 'value2'}

        self.storage.upload(b'content', test_path, test_metadata)

        metadata = self.storage.get_metadata(test_path)
        self.assertEqual(metadata['key1'], 'value1')
        self.assertEqual(metadata['key2'], 'value2')

    def test_get_metadata_nonexistent(self):
        metadata = self.storage.get_metadata('nonexistent.txt')
        self.assertEqual(metadata, {})

    def test_copy_file(self):
        source_path = 'source/file.txt'
        dest_path = 'dest/file.txt'
        test_content = b'content to copy'
        test_metadata = {'original': 'true'}

        # Upload source file
        self.storage.upload(test_content, source_path, test_metadata)

        # Copy file
        status_code = self.storage.copy(source_path, dest_path)
        self.assertEqual(status_code, 200)

        # Verify copy
        content, metadata = self.storage.get(dest_path)
        self.assertEqual(content, test_content)
        self.assertEqual(metadata['original'], 'true')

    def test_copy_file_with_new_metadata(self):
        source_path = 'source/file.txt'
        dest_path = 'dest/file.txt'
        test_content = b'content to copy'
        original_metadata = {'original': 'true'}
        new_metadata = {'copied': 'true', 'version': '2'}

        # Upload source file
        self.storage.upload(test_content, source_path, original_metadata)

        # Copy file with new metadata
        status_code = self.storage.copy(source_path, dest_path, new_metadata)
        self.assertEqual(status_code, 200)

        # Verify copy has new metadata
        content, metadata = self.storage.get(dest_path)
        self.assertEqual(content, test_content)
        self.assertEqual(metadata['copied'], 'true')
        self.assertEqual(metadata['version'], '2')

    def test_enum_files(self):
        # Upload multiple files
        files_to_upload = [
            'test/dir/file1.txt',
            'test/dir/file2.txt',
            'test/dir/subdir/file3.txt',
            'other/file4.txt'
        ]

        for file_path in files_to_upload:
            self.storage.upload(b'content', file_path)

        # Enumerate files in test/dir
        files, next_token = self.storage.enum_files('test/dir')

        # Should include files and subdirectory files
        expected_files = [
            'test/dir/file1.txt',
            'test/dir/file2.txt',
            'test/dir/subdir/file3.txt'
        ]

        self.assertEqual(sorted(files), sorted(expected_files))
        self.assertIsNone(next_token)  # Should be None for small result sets

    def test_enum_files_with_limit(self):
        # Upload multiple files
        for i in range(5):
            self.storage.upload(b'content', f'test/file{i}.txt')

        # Enumerate with limit
        files, next_token = self.storage.enum_files('test', limit=3)

        self.assertLessEqual(len(files), 3)
        # Note: next_token behavior depends on LocalStack implementation

    def test_enum_folders_fast_mode(self):
        # Upload files in different folders
        files_to_upload = [
            'test/folder1/file1.txt',
            'test/folder2/file2.txt',
            'test/folder3/subdir/file3.txt'
        ]

        for file_path in files_to_upload:
            self.storage.upload(b'content', file_path)

        # Enumerate folders
        folders = self.storage.enum_folders('test/', fast_mode=True)

        expected_folders = [
            'test/folder1/',
            'test/folder2/',
            'test/folder3/'
        ]

        self.assertEqual(sorted(folders), sorted(expected_folders))

    def test_enum_folders_regular_mode(self):
        # Upload files in different folders
        files_to_upload = [
            'test/folder1/file1.txt',
            'test/folder2/file2.txt',
            'test/folder3/subdir/file3.txt'
        ]

        for file_path in files_to_upload:
            self.storage.upload(b'content', file_path)

        # Enumerate folders (regular mode)
        folders = self.storage.enum_folders('test/', fast_mode=False)

        # Should include all folder paths including subdirectories
        expected_folders = [
            'test/folder1',
            'test/folder2',
            'test/folder3/subdir'
        ]

        self.assertEqual(sorted(folders), sorted(expected_folders))

    def test_get_versions(self):
        # Upload files with version structure
        version_files = [
            'resource/item1/1/file.txt',
            'resource/item1/2/file.txt',
            'resource/item1/10/file.txt',
            'resource/item1/other/file.txt',  # Not a version
        ]

        for file_path in version_files:
            self.storage.upload(b'content', file_path)

        versions = self.storage.get_versions('resource/item1/')

        # Should return sorted versions in descending order
        expected_versions = [10, 2, 1]
        self.assertEqual(versions, expected_versions)

    def test_get_latest_version(self):
        # Upload files with version structure
        version_files = [
            'resource/item1/5/file.txt',
            'resource/item1/10/file.txt',
            'resource/item1/3/file.txt',
        ]

        for file_path in version_files:
            self.storage.upload(b'content', file_path)

        latest_version = self.storage.get_latest_version('resource/item1/')
        self.assertEqual(latest_version, 10)

    def test_get_latest_version_no_versions(self):
        latest_version = self.storage.get_latest_version('nonexistent/path/')
        self.assertIsNone(latest_version)

    def test_search_files(self):
        # Upload files with various names
        files_to_upload = [
            'search/test/image1.jpg',
            'search/test/image2.png',
            'search/test/document.pdf',
            'search/test/photo_vacation.jpg',
            'search/other/data.txt'
        ]

        for file_path in files_to_upload:
            self.storage.upload(b'content', file_path)

        # Search for image files
        results = self.storage.search_files('search/test', 'image')

        # Should find files with 'image' in the name
        expected_files = ['image1.jpg', 'image2.png']
        self.assertEqual(sorted(results), sorted(expected_files))

    def test_search_files_with_limit(self):
        # Upload multiple matching files
        for i in range(10):
            self.storage.upload(b'content', f'search/test{i}.txt')

        results = self.storage.search_files('search', 'test', limit=5)
        self.assertLessEqual(len(results), 5)

    def test_copy_folder(self):
        # Upload files in source folder
        source_files = [
            'source/folder/file1.txt',
            'source/folder/file2.txt',
            'source/folder/subdir/file3.txt'
        ]

        for file_path in source_files:
            self.storage.upload(b'content', file_path, {'original': 'true'})

        # Copy folder
        status_codes = self.storage.copy_folder('source/folder', 'dest/folder')

        # All copies should succeed
        for status_code in status_codes:
            self.assertEqual(status_code, 200)

        # Verify copied files exist
        expected_dest_files = [
            'dest/folder/file1.txt',
            'dest/folder/file2.txt',
            'dest/folder/subdir/file3.txt'
        ]

        for file_path in expected_dest_files:
            self.assertTrue(self.storage.file_exists(file_path))
            content, metadata = self.storage.get(file_path)
            self.assertEqual(content, b'content')
            self.assertEqual(metadata['original'], 'true')

    def test_copy_folder_with_new_metadata(self):
        # Upload source file
        self.storage.upload(b'content', 'source/file.txt', {'version': '1'})

        # Copy with new metadata
        new_metadata = {'version': '2', 'copied': 'true'}
        status_codes = self.storage.copy_folder('source', 'dest', new_metadata)

        self.assertEqual(status_codes[0], 200)

        # Verify new metadata
        content, metadata = self.storage.get('dest/file.txt')
        self.assertEqual(metadata['version'], '2')
        self.assertEqual(metadata['copied'], 'true')

    def test_delete_folder(self):
        # Upload files in folder
        folder_files = [
            'delete_me/file1.txt',
            'delete_me/file2.txt',
            'delete_me/subdir/file3.txt'
        ]

        for file_path in folder_files:
            self.storage.upload(b'content', file_path)

        # Verify files exist
        for file_path in folder_files:
            self.assertTrue(self.storage.file_exists(file_path))

        # Delete folder
        self.storage.delete_folder('delete_me')

        # Verify files are deleted
        for file_path in folder_files:
            self.assertFalse(self.storage.file_exists(file_path))

    def test_list_file_names(self):
        # Upload files with name/version structure
        files_to_upload = [
            'resources/item1/5/data.json',
            'resources/item1/10/data.json',
            'resources/item2/3/data.json',
            'resources/item3/7/other.json',  # Different filename
        ]

        for file_path in files_to_upload:
            self.storage.upload(b'content', file_path)

        # List files matching 'data'
        results = self.storage.list_file_names('resources/', 'data')

        # Should return (name, latest_version) tuples
        expected_results = [
            ('item1', 10),  # Latest version for item1
            ('item2', 3),   # Only version for item2
        ]

        self.assertEqual(sorted(results), sorted(expected_results))

    def test_get_with_info(self):
        test_path = 'test/info.txt'
        test_content = b'content with info'
        test_metadata = {'info': 'test'}

        self.storage.upload(test_content, test_path, test_metadata)

        # Test get_with_info
        file_info = (test_path, 'info.txt', 1, '')
        buffer, metadata, path, name, version = self.storage.get_with_info(file_info)

        self.assertEqual(buffer, test_content)
        self.assertEqual(metadata['info'], 'test')
        self.assertEqual(path, test_path)
        self.assertEqual(name, 'info.txt')
        self.assertEqual(version, 1)

    def test_get_multiple(self):
        # Upload multiple files
        files_data = [
            ('file1.txt', b'content1', {'type': 'text'}),
            ('file2.txt', b'content2', {'type': 'text'}),
            ('file3.txt', b'content3', {'type': 'text'}),
        ]

        for filename, content, metadata in files_data:
            self.storage.upload(content, f'multi/{filename}', metadata)

        # Prepare file info for get_multiple
        file_infos = [
            (f'multi/{filename}', filename, 1, '') for filename, _, _ in files_data
        ]

        # Get multiple files
        results = self.storage.get_multiple(file_infos)

        # Verify all files were retrieved
        self.assertEqual(len(results), 3)

        for filename, content, metadata in files_data:
            key = f'multi/{filename}'
            self.assertIn(key, results)

            buffer, retrieved_metadata, name, version = results[key]
            self.assertEqual(buffer, content)
            self.assertEqual(retrieved_metadata['type'], 'text')
            self.assertEqual(name, filename)
            self.assertEqual(version, 1)

    def test_metadata_encoding_decoding(self):
        test_path = 'test/encoding.txt'
        test_metadata = {
            'special_chars': 'héllo wörld!',
            'spaces': 'has spaces',
            'symbols': 'test@#$%^&*()',
        }

        self.storage.upload(b'content', test_path, test_metadata)

        # Retrieve and verify metadata is properly decoded
        content, metadata = self.storage.get(test_path)
        self.assertEqual(metadata['special_chars'], 'héllo wörld!')
        self.assertEqual(metadata['spaces'], 'has spaces')
        self.assertEqual(metadata['symbols'], 'test@#$%^&*()')
