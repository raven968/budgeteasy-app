import { getLocales } from 'expo-localization';

/**
 * Dates travel to the API as local calendar dates (`YYYY-MM-DD`) and months as `YYYY-MM`.
 * Never use `toISOString()` for them: it converts to UTC and can shift the day.
 */

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function deviceLocale(): string {
  return getLocales()[0]?.languageTag ?? 'es-MX';
}

export function toDateString(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Local midnight of a `YYYY-MM-DD` string. */
export function parseDateString(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);

  return new Date(year, month - 1, day);
}

export function todayString(now = new Date()): string {
  return toDateString(now);
}

export function yesterdayString(now = new Date()): string {
  return toDateString(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1));
}

export function currentMonth(now = new Date()): string {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}`;
}

/** Adds (or subtracts) months to a `YYYY-MM` string. */
export function shiftMonth(month: string, offset: number): string {
  const [year, monthNumber] = month.split('-').map(Number);
  const shifted = new Date(year, monthNumber - 1 + offset, 1);

  return `${shifted.getFullYear()}-${pad(shifted.getMonth() + 1)}`;
}

/** "octubre de 2026" / "October 2026" */
export function formatMonthLabel(month: string, locale = deviceLocale()): string {
  return new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(parseDateString(`${month}-01`));
}

/** "jueves, 29 de octubre" / "Thursday, October 29" */
export function formatDayLabel(dateString: string, locale = deviceLocale()): string {
  return new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(
    parseDateString(dateString),
  );
}

/** "29 oct 2026" / "Oct 29, 2026" */
export function formatShortDate(dateString: string, locale = deviceLocale()): string {
  return new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'short', year: 'numeric' }).format(
    parseDateString(dateString),
  );
}
