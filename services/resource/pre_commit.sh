clear && \
echo "=====\nruff\n=====" && ruff check --fix .
echo "\n" && lint-imports && \
echo "\n====\nmypy\n====\n" && mypy -p api -p consumer -p common && \
echo "\n=====\ntests\n=====" && CI=1 DISABLE_LOCALSTACK=0 DD_TRACE_ENABLED=false LOG_LEVEL=warn python -m unittest
