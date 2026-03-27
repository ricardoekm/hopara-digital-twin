import json
import logging
import os
from typing import List

import boto3

from common.client.queue import Queue
from common.dictionary import get_bool
from common.process_resource_event import ResourceStep


class SQSQueue(Queue):
    def __init__(self, queue_name):
        self.queue_name = queue_name
        using_localstack = not get_bool(os.environ, 'DISABLE_LOCALSTACK', False)
        endpoint = "http://localhost:4566" if using_localstack else None
        logging.info(f'SQS queue={queue_name} | endpoint={endpoint}')
        self.client = boto3.client("sqs", endpoint_url=endpoint)
        response = None
        if using_localstack:
            try:
                url = self.client.get_queue_url(QueueName=queue_name)['QueueUrl']
                self.client.purge_queue(QueueUrl=url)
            except Exception:
                response = self.client.create_queue(
                    QueueName=queue_name,
                    Attributes={
                        'VisibilityTimeout': '0',
                        'ReceiveMessageWaitTimeSeconds': '0'
                    }
                )
        if not response:
            response = self.client.get_queue_url(QueueName=queue_name)
        self.queue_url = response.get('QueueUrl')

    def receive_messages(self):
        return self.client.receive_message(
            QueueUrl=self.queue_url,
            WaitTimeSeconds=20,
            MaxNumberOfMessages=1
        ).get('Messages', [])

    def delete_message(self, message):
        self.client.delete_message(QueueUrl=self.queue_url, ReceiptHandle=message['ReceiptHandle'])

    def send_message(self, payload):
        response = self.client.send_message(QueueUrl=self.queue_url, MessageBody=json.dumps(payload))
        return response.get('MessageId')

    def send_messages(self, payloads: List[ResourceStep]) -> None:
        for payload in payloads:
            self.send_message(payload)

    def get_name(self) -> str:
        return self.queue_name
