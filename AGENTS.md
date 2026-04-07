# Hopara Digital Twin

Open source digital twin platform — real-time visual representation of operations. Technically, a combination of Grafana, Figma, and Prezi.

## Monorepo structure

```
front/          # React frontend (yarn workspaces, multiple packages)
services/
  bff/          # BFF Node/TS — gateway between frontend and internal services
  visualization/ # Node/TS — manages visualizations, uses PostgreSQL
  dataset/      # Java/Spring Boot — data ingestion and querying
  template/     # Node/TS — manages visualization templates
  notification/ # Node/TS — notification service
  resource/     # Python — manages resources (images, files)
docker-compose.yml
storage/        # Local volumes (postgres, resource, data-files)
```

## Initial setup

```bash
git submodule update --init --recursive
```

## Local environment

```bash
docker compose up
```

Service ports:

| Service       | Port |
|---------------|------|
| front         | 3000 |
| bff           | 8086 |
| visualization | 8081 |
| dataset       | 8000 |
| template      | 8089 |
| notification  | 8085 |
| resource-api  | 2022 |
| PostgreSQL    | 5432 |

Data is persisted in `storage/` (do not commit).

## General conventions

- License: AGPL-3.0
- TypeScript across all Node.js services
- Each service has its own `yarn.lock` or `gradlew` — do not mix package managers
- Always run the service's `pre-commit` script before committing (see each service's AGENTS.md)
- Do not edit files in `out/`, `build/`, or `dist/` directories — they are generated
