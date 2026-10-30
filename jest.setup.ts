jest.mock('expo-localization', () => ({ getLocales: () => [{ languageCode: 'es' }] }));

jest.mock('@/lib/config', () => ({
  config: { apiUrl: 'http://api.test/api/v1', appVersion: '0.1.0' },
}));
