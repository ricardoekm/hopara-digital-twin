"""
Run your existing WSGI application using `python -m myapp`.
"""
import sys

from api.app import create_app
from common.server import serve
from common.server_util import parse_args


def main():
    args = parse_args(sys.argv[1:])
    args["application"] = create_app()
    args["health_check_path"] = "/health"
    args["port"] = 2022
    serve(**args)


if __name__ == "__main__":
    main()
