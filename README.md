# BudgetEasy App

App móvil de BudgetEasy (Expo SDK 58 · React Native · TypeScript). Convenciones y reglas en [CLAUDE.md](CLAUDE.md).

## Requisitos

- Node 22+
- El API de BudgetEasy corriendo (repositorio `budgeteasy-api`)
- Xcode / Android Studio para simuladores

## Instalación

```sh
npm install
cp .env.example .env   # ajusta EXPO_PUBLIC_API_URL
npx expo start
```

## Calidad

```sh
npm run lint
npm run typecheck
```

## Versionado

SemVer, versión en `package.json`. Ver [CHANGELOG.md](CHANGELOG.md).
