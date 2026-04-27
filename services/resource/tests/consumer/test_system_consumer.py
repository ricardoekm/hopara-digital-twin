import unittest

from consumer.app import consumer, create_app
from tests.test_utils import clean_up, get_storage


class TestConsumer(unittest.TestCase):
    @classmethod
    def setUp(cls):
        cls.storage = get_storage()
        cls.app = create_app()
        cls.test_app = cls.app.test_client()
        consumer.storage = cls.storage

    @classmethod
    def tearDownClass(cls):
        consumer.stop_listening()

    def test_api_process_message(self):
        destination_path = 'icon/processed/file2.webp'
        clean_up(self.storage, destination_path)
        self.assertEqual(self.storage.get_metadata(destination_path), {})
        self.storage.upload(b'''
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
            <ellipse cx="2" cy="1" rx="1" ry="1"></ellipse>
        </svg>
        ''', "/icon/original/file.svg")
        res = self.test_app.put('/process_message', json={
            "data": {
                "origin": "/icon/original/file.svg",
                "destination": destination_path,
            },
            "type": "icon_resize"
        })
        self.assertEqual(200, res.status_code)
        metadata = self.storage.get_metadata(destination_path)
        self.assertEqual({'height': 256, 'width': 256}, metadata)
        clean_up(self.storage, destination_path)

    def test_api_process_message_many_destinations(self):
        destination_paths = [
            '/icon/processed/file2.webp',
            '/icon/processed/file3.webp',
        ]
        for destination_path in destination_paths:
            clean_up(self.storage, destination_path)
            self.assertEqual(self.storage.get_metadata(destination_path), {})
        res = self.test_app.put('/process_message', json={
            "data": {
                "origin": "/icon/original/file.svg",
                "destinations": destination_paths,
            },
            'notification': {
                'tenant': 'hopara.io',
                'library': 'any_library',
                'name': 'any_name',
                'progress': 0.1,
                'event': 'GENERATE_PROGRESS',
            },
            "type": "copy"
        })
        self.assertEqual(200, res.status_code)
        buffer1 = self.storage.get(destination_paths[0])[0]
        buffer2 = self.storage.get(destination_paths[1])[0]
        self.assertGreater(len(buffer1), 100)
        self.assertGreater(len(buffer2), 100)

    def test_api_health_check(self):
        self.assertEqual(200, self.test_app.get('/health').status_code)
