import json
import unittest
from typing import Any, Dict, cast
from unittest.mock import MagicMock, patch

from common.resource_state import ResourceState
from consumer.main_worker import MainWorker
from tests.test_utils import any_tenant


class TestMainWorker(unittest.TestCase):
    @classmethod
    def setUp(cls):
        # Mock external dependencies
        cls.fake_queue = MagicMock()
        cls.fake_storage = MagicMock()
        cls.fake_cache = MagicMock()
        cls.fake_worker = MagicMock()
        cls.notifier = MagicMock()

        # Configure worker mocks
        cls.workers: Any = {
            'any_worker_type': cls.fake_worker,
        }

        # Create MainWorker instance
        cls.main_worker = MainWorker(
            cls.fake_queue,
            cls.fake_storage,
            cls.fake_cache,
            cls.workers,
            cls.notifier
        )

        # Common test data
        cls.valid_payload: Any = {
            'type': 'sequential',
            'steps': [{
                'type': 'any_worker_type',
                'data': {
                    'origin': 's3://bucket/input.jpg',
                    'destination': 's3://bucket/output.jpg',
                    'metadata': {'key': 'value'}
                },
                'invalidation_urls': ['/path/to/invalidate'],
            }, {
                'type': 'next_step',
                'data': {}
            }]
        }

        # Mock response data
        cls.mock_input_buffer = b'fake-image-data'
        cls.mock_metadata = {'mimetype': 'image/jpeg', 'size': 1024}

    ### validate
    def test_validate_payload_no_type(self):
        invalid_payload: Any = {'other': 'value'}
        with self.assertRaises(ValueError):
            self.main_worker.validate_step(invalid_payload)

    def test_validate_payload_missing_data(self):
        invalid_payload: Any = {'type': 'any_worker_type'}
        with self.assertRaises(ValueError):
            self.main_worker.validate_step(invalid_payload)

    def test_validate_step_missing_paths(self):
        invalid_step = {
            'type': 'any_worker_type',
            'data': {
                'any_other': 'value'
            }
        }
        with self.assertRaises(ValueError):
            self.main_worker.validate_step(cast(Any, invalid_step))

    def test_validate_step_valid(self):
        self.main_worker.validate_step(self.valid_payload['steps'][0])

    ## get_input_data
    def test_get_input_data_success(self):
        metadata = {'origin': 's3://bucket/input.jpg'}
        self.fake_storage.get.return_value = (self.mock_input_buffer, self.mock_metadata)
        buffer, metadata_result = self.main_worker.get_input_data('any_cwd', metadata)

        self.fake_storage.get.assert_called_once_with('s3://bucket/input.jpg', cwd='any_cwd')
        self.assertEqual(buffer, self.mock_input_buffer)
        self.assertEqual(metadata_result, self.mock_metadata)

    def test_get_input_data_not_found(self):
        metadata = {'origin': 's3://bucket/nonexistent.jpg'}
        self.fake_storage.get.return_value = (None, {})

        # Verify
        with self.assertRaises(ValueError):
            self.main_worker.get_input_data('', metadata)

    ### upload
    def test_upload_with_mimetype(self):
        # Setup
        message = {
            'data': {
                'destination': 's3://bucket/output.jpg',
                'metadata': {'additional': 'metadata'}
            }
        }
        buffers = [b'processed-data']
        metadata = {'mimetype': 'image/jpeg'}
        self.main_worker.upload(message, buffers, metadata)

        # Verify
        expected_metadata = {'mimetype': 'image/jpeg', 'additional': 'metadata'}
        self.fake_storage.upload.assert_called_once_with(
            buffers[0], 's3://bucket/output.jpg', expected_metadata, cwd=''
        )

    def test_upload_without_mimetype(self):
        message = {
            'data': {
                'destination': 's3://bucket/output.jpg',
                'metadata': {'additional': 'metadata'}
            }
        }
        buffers = [b'processed-data']
        metadata = {}
        self.main_worker.upload(message, buffers, metadata)

        # Verify
        expected_metadata = {'additional': 'metadata'}
        self.fake_storage.upload.assert_called_once_with(
            buffers[0], 's3://bucket/output.jpg', expected_metadata, cwd=''
        )

    ### process_payload
    def test_process_payload_success(self):
        # Setup
        output_buffer = [b'processed-output']
        output_metadata = {'processed': True}
        self.fake_storage.get.return_value = (self.mock_input_buffer, self.mock_metadata)
        self.fake_worker.process.return_value = (output_buffer, output_metadata)
        self.main_worker.validate_step = MagicMock()

        # Execute
        self.main_worker.process_payload(self.valid_payload)

        # Verify
        self.main_worker.validate_step.assert_called_once_with(self.valid_payload['steps'][0])
        self.fake_storage.get.assert_called_once_with('s3://bucket/input.jpg', cwd='')
        self.fake_storage.file_exists.assert_called_once_with('s3://bucket/output.jpg', cwd='')
        self.fake_worker.process.assert_called_once()
        self.fake_storage.upload.assert_called_once()
        self.fake_cache.invalidate.assert_called_once_with(['/path/to/invalidate'])
        self.fake_queue.send_message.assert_called_once_with(
            {'type': 'sequential', 'steps': [{'type': 'next_step', 'data': {}}]})

    def test_process_payload_should_send_notification(self):
        output_buffer = [b'processed-output']
        output_metadata = {'processed': True}
        self.fake_storage.get.return_value = (self.mock_input_buffer, self.mock_metadata)
        self.fake_worker.process.return_value = (output_buffer, output_metadata)
        self.main_worker.validate_step = MagicMock()

        notification_obj: Dict[str, Any] = {
            'type': 'image',
            'library': 'any_target',
            'tenant': any_tenant,
            'name': 'any_name',
            'progress': 0.5
        }

        # Common test data
        payload_with_notification: Any = {
            'cwd': 'any_cwd',
            'type': 'any_worker_type',
            'data': {
                'origin': 's3://bucket/input.jpg',
                'destination': 's3://bucket/output.jpg',
                'metadata': {'key': 'value'}
            },
            'notification': notification_obj
        }
        self.main_worker.process_payload(payload_with_notification)
        self.notifier.notify.assert_called_once_with(notification_obj)

        processing_payload = {'processing': True}
        processing_payload.update(notification_obj)


    ### sync_process
    @patch('threading.Thread')
    @patch('queue.Queue')
    def test_sync_process_success(self, mock_queue_class, mock_thread_class):
        # Setup mock thread and queue
        mock_thread = MagicMock()
        mock_thread_class.return_value = mock_thread
        mock_thread.is_alive.return_value = False

        mock_queue = MagicMock()
        mock_queue.empty.return_value = True
        mock_queue_class.return_value = mock_queue
        self.main_worker.process_payload = MagicMock()
        result = self.main_worker.process_sync(self.valid_payload)

        # Verify
        mock_thread.start.assert_called_once()
        mock_thread.join.assert_called_once()
        self.assertEqual(result, ResourceState.SUCCESS)  # Should return empty metadata dict on success

    @patch('threading.Thread')
    @patch('queue.Queue')
    def test_process_with_timeout_still_processing(self, mock_queue_class, mock_thread_class):
        # Setup mock thread and queue
        mock_thread = MagicMock()
        mock_thread_class.return_value = mock_thread
        mock_thread.is_alive.return_value = True

        mock_queue = MagicMock()
        mock_queue.empty.return_value = True
        mock_queue_class.return_value = mock_queue

        # Execute
        result = self.main_worker.process_sync(self.valid_payload)
        self.assertEquals(result, ResourceState.PROCESSING)

        # Verify
        mock_thread.start.assert_called_once()
        mock_thread.join.assert_called_once()

    @patch('threading.Thread')
    @patch('queue.Queue')
    def test_process_with_timeout_error(self, mock_queue_class, mock_thread_class):
        # Setup mock thread and queue
        mock_thread = MagicMock()
        mock_thread_class.return_value = mock_thread

        mock_queue = MagicMock()
        mock_queue.empty.return_value = False
        mock_queue.get.return_value = ValueError("Test error")
        mock_queue_class.return_value = mock_queue

        # Execute and verify exception is raised
        with self.assertRaises(ValueError):
            self.main_worker.process_sync(self.valid_payload)

    ### process_queue_message
    def test_process_queue_message_with_empty_body(self):
        # Setup
        mock_message = {'Body': ''}
        self.fake_queue.receive_messages.return_value = [mock_message]
        self.main_worker.process_payload = MagicMock()
        # Execute
        self.main_worker.process_queue_message(mock_message)
        # Verify
        self.main_worker.process_payload.assert_not_called()
        self.fake_queue.delete_message.assert_not_called()

    def test_process_queue_message(self):
        # Setup
        mock_message = {'Body': json.dumps(self.valid_payload)}
        self.fake_queue.receive_messages.return_value = [mock_message]
        self.main_worker.process_payload = MagicMock()
        self.main_worker.process_queue_message(mock_message)
        # Verify
        self.main_worker.process_payload.assert_called_once_with(self.valid_payload, 'unknown')
        self.fake_queue.delete_message.assert_called_once_with(mock_message)

    def test_process_queue_message_error(self):
        # Setup
        mock_message = {'Body': json.dumps(self.valid_payload)}
        self.fake_queue.receive_messages.return_value = [mock_message]
        self.main_worker.process_payload = MagicMock(side_effect=Exception("Processing error"))
        self.main_worker.process_queue_message(mock_message)
        # Verify
        # assert error was  logged
        self.main_worker.process_payload.assert_called_once_with(self.valid_payload, 'unknown')
        self.fake_queue.delete_message.assert_not_called()  # Message should not be deleted on error

    ### process_queue_messages
    @patch('json.loads')
    def test_listen_process_queue_messages(self, mock_json_loads):
        # Setup
        mock_messages = [
            {'Body': json.dumps(self.valid_payload)},
            {'Body': json.dumps(self.valid_payload)}
        ]
        self.fake_queue.receive_messages.return_value = mock_messages
        mock_json_loads.return_value = self.valid_payload
        self.main_worker.process_queue_message = MagicMock()

        # Execute
        self.main_worker.process_queue_messages()

        # Verify
        self.fake_queue.receive_messages.assert_called_once()
        self.assertEqual(self.main_worker.process_queue_message.call_args_list, [
            ((mock_messages[0],),),
            ((mock_messages[1],),)
        ])

    ### start_listening and stop_listening
    @patch('threading.Thread')
    def test_start_stop_listening(self, mock_thread_class):
        # Setup
        mock_thread = MagicMock()
        mock_thread_class.return_value = mock_thread

        # Test start_listening
        self.main_worker.start_listening()
        mock_thread_class.assert_called_once()
        mock_thread.start.assert_called_once()
        self.assertEqual(self.main_worker.stopped, False)

        # Test stop_listening
        self.main_worker.stop_listening()
        mock_thread.join.assert_called_once()
        self.assertIsNone(self.main_worker.thread)
