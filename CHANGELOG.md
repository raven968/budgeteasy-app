# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- New look based on daisyUI's nord (light) and dim (dark) themes, with daisyUI-style tokens (`base100/200/300`, semantic colors) and a `Card` component. Two nord colors deepened to keep AA contrast.
- Package manager switched to pnpm, with `minimumReleaseAge` of 1 day as supply-chain protection.

### Added

- Expo SDK 58 project with Expo Router and TypeScript.
- `app.config.ts` reading the app version from `package.json`.
- API client (axios) with the Bearer token from SecureStore and `Accept-Language`; 401 hook for sign-out.
- Helpers for Laravel validation errors and user-facing error messages.
- Spanish/English translations (i18next) detected from the device language, Spanish by default.
- TanStack Query client; forced update screen when the app is older than the API's `min_mobile_version`.
- Unit tests with jest-expo.
- Sign in and sign up screens with client validation (zod) and API errors shown on each field.
- Session handling: restored from the stored token on launch, invalid tokens discarded, retry screen when the API is unreachable, sign out revokes the device token. Routes protected with `Stack.Protected`.
- Budgets: list of owned and shared budgets, create, edit and delete (owner only), and the active budget, remembered per user on the device.
- Categories: list with the `n/10` counter, create, edit and delete; 20 icons (SF Symbols on iOS, Material Symbols on Android) and 10 Nord colors, with a live preview. Creating is disabled at the limit.
- Home shows the active budget or an empty state to create the first one.
- Money helpers: cents ↔ input without floating point errors, localized currency formatting.
- `Badge`, `LoadingScreen` and `ErrorState` components.
- Theme tokens (light/dark) and base components: `Screen`, `ThemedText`, `TextField`, `Button`.
