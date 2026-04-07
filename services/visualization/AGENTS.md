# Visualization Service

Node.js + TypeScript. Manages visualizations and specs, persisted in PostgreSQL via TypeORM.

## Main commands

```bash
yarn start              # Development mode (nodemon, port 8081)
yarn build              # Compile TypeScript to out/
yarn unit-test          # Unit tests
yarn integration-test   # Integration tests (requires PostgreSQL running)
yarn test               # lint + unit + integration
yarn pre-commit         # build-schemas + build-docs + test (run before committing)
```

## Special commands

```bash
yarn migrate            # Run database migrations
yarn build-schemas      # Generate JSON Schema from TypeScript types (out/schemas/schema.json)
yarn build-docs         # Generate documentation
```

## Structure

```
src/
  index.ts              # Entrypoint
  migrate.ts            # Migration script
  build/                # Docs and schema generation
out/                    # Compiled output — do not edit
out/schemas/            # Generated JSON schemas — do not edit manually
```

## Database

- PostgreSQL via TypeORM
- Variables: `DB_HOST`, `DB_USER`, `DB_PASSWORD`
- Locally: `db` in docker-compose (port 5432, user/pass: kyrix)
- Always run `yarn migrate` after pulling if there are new migrations

## Conventions

- DI with awilix
- Schemas generated via `ts-json-schema-generator` — edit TypeScript types, not the JSON directly
- Integration tests require a running database
