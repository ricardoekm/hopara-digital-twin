# Resource Service

Python. Manages resources such as images and files. Two components: `api/` (resource-api, port 2022) and `consumer/` (resource-consumer, port 2023).

## Main commands

```bash
./pre_commit.sh         # ruff + lint-imports + mypy + tests (run before committing)
python -m unittest      # Tests only
ruff check --fix .      # Lint and auto-fix
mypy -p api -p consumer -p common   # Type checking
```

## Environment variables

| Variable               | Description                              |
|------------------------|------------------------------------------|
| `DISABLE_LOCALSTACK`   | Set to `true` in local dev without LocalStack |
| `LOCAL_STORAGE_PATH`   | Path for local storage                   |
| `CONSUMER_URL`         | Consumer URL (used by the API)           |

## Structure

```
api/            # Resource API (port 2022)
consumer/       # Resource Consumer (port 2023)
common/         # Shared code
resources/      # Resource files
tests/          # Tests
```

## Conventions

- Ruff for linting (configured in `ruff.toml`)
- Mypy for types (configured in `mypy.ini`)
- Tests with `unittest`
- Local storage in `storage/resource/` (mapped via docker volume)
