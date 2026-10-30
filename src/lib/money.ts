import { getLocales } from 'expo-localization';

/** Currencies supported by the API (`config/budgets.php`). */
export const CURRENCIES = ['MXN', 'USD', 'EUR', 'CAD', 'GBP', 'COP', 'ARS', 'CLP', 'PEN'] as const;
export type Currency = (typeof CURRENCIES)[number];

const CENTS_PER_UNIT = 100;
const MONEY_INPUT_PATTERN = /^\d+([.,]\d{1,2})?$/;

/**
 * Formats integer cents as a localized currency string, e.g. 150000 -> "$1,500.00".
 */
export function formatMoney(cents: number, currency: string, locale = getLocales()[0]?.languageTag ?? 'es-MX'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(cents / CENTS_PER_UNIT);
}

export function isValidMoneyInput(input: string): boolean {
  return MONEY_INPUT_PATTERN.test(input.trim());
}

/**
 * Converts user input ("1500", "1500.5", "1500,50") to integer cents without floating
 * point errors. Returns null when the input is not a valid amount.
 */
export function parseMoneyInput(input: string): number | null {
  const normalized = input.trim();

  if (!isValidMoneyInput(normalized)) {
    return null;
  }

  const [units, decimals = ''] = normalized.split(/[.,]/);

  return Number(units) * CENTS_PER_UNIT + Number(decimals.padEnd(2, '0'));
}

/**
 * Converts integer cents to an editable input value: 150000 -> "1500", 150050 -> "1500.50".
 */
export function centsToMoneyInput(cents: number): string {
  const units = Math.trunc(cents / CENTS_PER_UNIT);
  const remainder = cents % CENTS_PER_UNIT;

  return remainder === 0 ? String(units) : `${units}.${String(remainder).padStart(2, '0')}`;
}
