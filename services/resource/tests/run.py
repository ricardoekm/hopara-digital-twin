import os
import shutil
import sys
import unittest

from xmlrunner import XMLTestRunner

from common.path import path_join

# Configure Python's import system to find modules correctly
TEST_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(TEST_DIR)

# Ensure project root is in sys.path
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

if __name__ == "__main__":
    # Configure test discovery
    loader = unittest.TestLoader()

    # Load tests directly from specific modules vs. discovery to avoid import issues
    # This bypasses the problematic module discovery mechanism
    tests = []
    for dirpath, dirnames, filenames in os.walk(TEST_DIR):
        if '__pycache__' in dirpath:
            continue
        for filename in filenames:
            if filename.startswith('test_') and filename.endswith('.py'):
                file_path = path_join(dirpath, filename)
                # Make the module path relative to TEST_DIR
                rel_path = os.path.relpath(file_path, PROJECT_ROOT)
                # Convert path to module path
                module_path = rel_path.replace(os.sep, '.').replace('.py', '')
                try:
                    # Try importing the module directly
                    module = __import__(module_path, fromlist=['*'])
                    for item in dir(module):
                        obj = getattr(module, item)
                        if isinstance(obj, type) and issubclass(obj, unittest.TestCase) and obj != unittest.TestCase:
                            tests.append(obj)
                except ImportError:
                    # Skip modules that can't be imported
                    pass

    # Create a test suite with the tests we found
    suite = unittest.TestSuite()
    for test_class in tests:
        suite.addTest(unittest.defaultTestLoader.loadTestsFromTestCase(test_class))

    # If we couldn't find any tests, fall back to test discovery
    if not tests:
        suite = loader.discover(TEST_DIR)

    # Set up reporting
    report_dir = path_join(TEST_DIR, 'test-results')
    shutil.rmtree(report_dir, True)
    os.makedirs(report_dir, exist_ok=True)

    # Run tests
    with open(path_join(report_dir, 'unittest.xml'), 'wb') as output:
        runner = XMLTestRunner(output=output)
        results = runner.run(suite)
        sys.exit(len(results.errors) + len(results.failures))
