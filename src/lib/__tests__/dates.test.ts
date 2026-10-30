import {
  currentMonth,
  formatDayLabel,
  formatMonthLabel,
  parseDateString,
  shiftMonth,
  toDateString,
  todayString,
  yesterdayString,
} from '@/lib/dates';

describe('local date strings', () => {
  it('uses the local calendar day, not UTC', () => {
    expect(toDateString(new Date(2026, 9, 29, 23, 30))).toBe('2026-10-29');
    expect(toDateString(new Date(2026, 0, 1, 0, 5))).toBe('2026-01-01');
  });

  it('round-trips through parseDateString', () => {
    expect(toDateString(parseDateString('2026-03-09'))).toBe('2026-03-09');
  });

  it('computes today, yesterday and the current month', () => {
    const now = new Date(2026, 10, 1, 8);

    expect(todayString(now)).toBe('2026-11-01');
    expect(yesterdayString(now)).toBe('2026-10-31');
    expect(currentMonth(now)).toBe('2026-11');
  });
});

describe('shiftMonth', () => {
  it.each([
    ['2026-10', 1, '2026-11'],
    ['2026-12', 1, '2027-01'],
    ['2026-01', -1, '2025-12'],
    ['2026-10', -12, '2025-10'],
  ])('shifts %s by %d', (month, offset, expected) => {
    expect(shiftMonth(month, offset)).toBe(expected);
  });
});

describe('labels', () => {
  it('formats months and days in the given locale', () => {
    expect(formatMonthLabel('2026-10', 'es-MX')).toBe('octubre de 2026');
    expect(formatMonthLabel('2026-10', 'en-US')).toBe('October 2026');
    expect(formatDayLabel('2026-10-29', 'en-US')).toBe('Thursday, October 29');
  });
});
