import Constants from 'expo-constants';

function requireApiUrl(): string {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error('EXPO_PUBLIC_API_URL is not set. Copy .env.example to .env and set it.');
  }

  return apiUrl.replace(/\/+$/, '');
}

export const config = {
  apiUrl: requireApiUrl(),
  /** App version from package.json, injected by app.config.ts. */
  appVersion: Constants.expoConfig?.version ?? '0.0.0',
} as const;
