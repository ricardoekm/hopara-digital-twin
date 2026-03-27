import os
import re
import uuid

from common.client.local_storage import LocalStorage
from common.client.storage import Storage
from common.path import path_join

TEST_ROOT = os.path.dirname(os.path.abspath(__file__))
FIXTURES_DIR = path_join(TEST_ROOT, 'fixtures')

any_tenant = 'any_tenant'
any_library = 'any_library'
any_name = 'any_name'
any_buffer = b'buffer content'
any_invalidation_url = 'any-invalidation-url'
any_version = 12345678
any_new_version = 12345679
any_query = 'any_query'


def upload(storage: Storage, local_path: str, remote_path: str, metadata=None, cwd: str = ''):
    with open(local_path, 'rb') as buffer:
        storage.upload(buffer.read(), remote_path, metadata, cwd=cwd)


def clean_up(storage: Storage, remote_path):
    storage.delete(remote_path)


class BufferSizeValidator:
    def __init__(self, size):
        self.size = size

    def __eq__(self, buffer: bytes):
        if len(buffer) == self.size:
            return True
        raise BufferError(f'Size expected {self.size}, received {len(buffer)} bytes')


class BufferSizeGtValidator:
    def __init__(self, size):
        self.size = size

    def __eq__(self, buffer: bytes):
        if len(buffer) > self.size:
            return True
        raise BufferError(f'Size expected {self.size}, received {len(buffer)} bytes')


class ObjectTypeValidator:
    def __init__(self, type):
        self.type = type

    def __eq__(self, obj):
        return isinstance(obj, self.type)


def get_authorization_header():
    return {
        'Authorization': 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2F1dGgudGVzdC5ob3BhcmEuYXBwIiwidXNlcl9wb29sX2lkIjoidXMtZWFzdC0xX1U3Z1NqVzZlcSIsImlhdCI6MTc1MjYzMTg3NSwiYXV0aF90aW1lIjoxNzUyNjMxODc1LCJ0ZW5hbnRzIjpbImFueV90ZW5hbnQiXSwic3VwZXJfdXNlciI6dHJ1ZSwiZW1haWwiOiJtMm1AaG9wYXJhLmlvIiwic2NvcGUiOiJhcHA6bGlzdCBhcHA6cmVhZCByZXNvdXJjZTpyZWFkIHJvdzpyZWFkIHRlbmFudDpyZWFkIHJlc291cmNlOndyaXRlIHJvdzp3cml0ZSBkYXRhLXNvdXJjZTpyZWFkIGFwcDp3cml0ZSB0YWJsZTp3cml0ZSBkYXRhLXNvdXJjZTp3cml0ZSB2aWV3OndyaXRlIHRlbmFudDp3cml0ZSB1c2VyOnJlYWQgdXNlcjp3cml0ZSB0ZW5hbnQ6YWRtaW4ifQ.TscDeaQn6FSTP1aVc406pZLVn5UkFlX68XwLDzDl_TvMAT-QQAzoWXsdP2u8Lp_ZHmYIbR3ZtVuCQxPJNRqFyx7IyvWRpgvmeJAlc_9SJsHPKfyDrjVpZ0RBxh73pN2Zt0WEYapFm1G5BOuJaIVrZO3hRhTorskUayu5IxpORdFVFAKhcZlawpCHn4iTcZm-U8T9_icCPk3SXohtmYGzNP0P9Xs6ojweBWmFZSB4ATVTPGEVUp4GX1eeqj9nW8sHOpzIri7Nb5nEfrggt2m3rb0b8rEXiVDL3xJTrdgjSC9NPIeIqIKpp4xjQ9qPBiI_NQALGT5qG9ns3Ib6Z1ZAPg',
    }


def get_random_name():
    return f'random-name-{uuid.uuid4()}'


class RegexMatcher:
    def __init__(self, pattern: str):
        self.pattern = re.compile(pattern)

    def __eq__(self, other):
        return bool(self.pattern.search(other))


def get_storage():
    return LocalStorage(path_join(FIXTURES_DIR, 'local_storage'))
