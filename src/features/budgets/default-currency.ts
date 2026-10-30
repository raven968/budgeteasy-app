import { getLocales } from 'expo-localization';

import { CURRENCIES, type Currency } from '@/lib/money';

/** The device currency when the API supports it, Mexican peso otherwise. */
export function getDefaultCurrency(): Currency {
  const deviceCurrency = getLocales()[0]?.currencyCode;

  return CURRENCIES.find((currency) => currency === deviceCurrency) ?? 'MXN';
}
