# BudgetEasy App

App móvil de BudgetEasy (Expo SDK 58 · React Native · TypeScript). Convenciones y reglas en [CLAUDE.md](CLAUDE.md).

## Requisitos

- Node 22+ y pnpm 10 (`corepack enable` toma la versión de `packageManager`)
- El API de BudgetEasy corriendo (repositorio `budgeteasy-api`)
- Xcode / Android Studio para simuladores

## Instalación

```sh
pnpm install
cp .env.example .env   # ajusta EXPO_PUBLIC_API_URL
pnpm expo start
```

## Calidad

```sh
pnpm lint
pnpm typecheck
pnpm test
```

## Versionado

SemVer, versión en `package.json`. Ver [CHANGELOG.md](CHANGELOG.md).
