# Dataset Service

Java + Spring Boot, built with Gradle. Responsible for data ingestion and querying.

## Main commands

```bash
./gradlew build         # Compile and run tests
./gradlew test          # Tests only
./gradlew bootRun       # Start the service locally (port 8000)
```

## Configuration variables

Passed as system properties (`-D`) — see `docker-compose.yml` for reference:

| Property                 | Description                    |
|--------------------------|--------------------------------|
| `databaseServer`         | PostgreSQL host                |
| `databaseUsername`       | Database user                  |
| `databasePassword`       | Database password              |
| `databaseName`           | Database name                  |
| `notificationEndpoint`   | Notification service URL       |
| `templateEndpoint`       | Template service URL           |
| `dataFiles.dir`          | Data files directory           |

## Structure

```
src/            # Java source code
build/          # Compiled output — do not edit
libs/           # Local dependencies
```

## Conventions

- Spring Boot configured via system properties
- Data files stored in `storage/data-files/` (mapped via docker volume)
