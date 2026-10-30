# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Expo SDK 58 project with Expo Router and TypeScript.
- `app.config.ts` reading the app version from `package.json`.
- API client (axios) with the Bearer token from SecureStore and `Accept-Language`; 401 hook for sign-out.
- Helpers for Laravel validation errors and user-facing error messages.
- Spanish/English translations (i18next) detected from the device language, Spanish by default.
- TanStack Query client; forced update screen when the app is older than the API's `min_mobile_version`.
- Unit tests with jest-expo.
