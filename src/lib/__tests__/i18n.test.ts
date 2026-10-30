import { getLocales } from 'expo-localization';

import { detectDeviceLanguage } from '@/lib/i18n';

jest.mock('expo-localization', () => ({ getLocales: jest.fn(() => [{ languageCode: 'es' }]) }));

const mockedGetLocales = jest.mocked(getLocales);

function deviceLanguages(...languageCodes: (string | null)[]) {
  mockedGetLocales.mockReturnValue(
    languageCodes.map((languageCode) => ({ languageCode })) as ReturnType<typeof getLocales>,
  );
}

describe('detectDeviceLanguage', () => {
  it('uses the first supported device language', () => {
    deviceLanguages('fr', 'en', 'es');

    expect(detectDeviceLanguage()).toBe('en');
  });

  it('falls back to spanish when no device language is supported', () => {
    deviceLanguages('fr', null);

    expect(detectDeviceLanguage()).toBe('es');
  });
});
