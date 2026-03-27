from setuptools import find_packages, setup

setup(
    name='hopara-resource',
    version='1.0',
    packages=find_packages(exclude=['tests', 'tests.*']),
)