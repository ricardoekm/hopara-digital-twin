import os

from common.logger import setup_logger

setup_logger()
os.environ['RUNNING_TEST'] = 'true'
