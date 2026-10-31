import type { ConfigContext, ExpoConfig } from 'expo/config';

import packageJson from './package.json';

/**
 * The app version comes from package.json, the single source of truth (see CLAUDE.md).
 */
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'BudgetEasy',
  slug: 'budgeteasy',
  version: packageJson.version,
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'budgeteasy',
  userInterfaceStyle: 'automatic',
  ios: {
    bundleIdentifier: 'com.raventechnologic.budgeteasy',
    icon: './assets/expo.icon',
  },
  android: {
    package: 'com.raventechnologic.budgeteasy',
    adaptiveIcon: {
      backgroundColor: '#ECEFF4',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: 'server',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#4D6E96',
        image: './assets/images/splash-icon.png',
        imageWidth: 76,
      },
    ],
    'expo-secure-store',
    'expo-localization',
  ],
  owner: 'raven968',
  extra: {
    eas: {
      projectId: 'bf42a2f0-2835-4956-98de-2c26bba2ac6f',
    },
  },
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
});
