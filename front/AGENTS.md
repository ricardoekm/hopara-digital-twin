# Front

React + TypeScript, organized as yarn workspaces with multiple packages under `packages/`.

## Main commands

```bash
yarn start              # Start the web app in development mode
yarn build              # Build all packages (topological order)
yarn test               # Lint + tests across all packages
yarn lint               # Lint only
yarn pre-commit         # lint + test (run before committing)
```

## Main packages

| Package               | Description                      |
|-----------------------|----------------------------------|
| `@hopara/web`         | Main React app                   |
| `@hopara/iframe`      | Embeddable version via iframe    |
| `@hopara/react`       | React component library          |
| `@hopara/design-system` | Design system                  |
| `@hopara/state`       | State management                 |
| `@hopara/dataset`     | Dataset service integration      |

## Structure

```
packages/       # Individual workspaces
  web/          # Main app (port 3000)
  iframe/       # Embeddable app
  react/        # Component library
  ...
```

## Conventions

- Node.js >= 18, yarn 4
- Tests with Jest + Testing Library
- ESLint configured in `eslint.config.js` at the front root
- TypeScript strict — avoid `any` without justification
- `out/` and `build/` files are generated — do not edit
- To work on a specific package: `yarn workspace @hopara/<name> <script>`
