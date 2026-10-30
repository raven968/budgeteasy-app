import { centsToMoneyInput, formatMoney, isValidMoneyInput, parseMoneyInput } from '@/lib/money';

describe('parseMoneyInput', () => {
  it.each([
    ['1500', 150_000],
    ['1500.5', 150_050],
    ['1500,50', 150_050],
    [' 0.99 ', 99],
    ['1.005', null],
    ['1,500.00', null],
    ['-5', null],
    ['abc', null],
    ['', null],
  ])('parses %j as %j', (input, expected) => {
    expect(parseMoneyInput(input)).toBe(expected);
  });

  it('avoids floating point errors', () => {
    expect(parseMoneyInput('0.29')).toBe(29);
    expect(parseMoneyInput('1.15')).toBe(115);
  });
});

describe('centsToMoneyInput', () => {
  it.each([
    [150_000, '1500'],
    [150_050, '1500.50'],
    [150_005, '1500.05'],
    [99, '0.99'],
  ])('converts %d to %j', (cents, expected) => {
    expect(centsToMoneyInput(cents)).toBe(expected);
    expect(parseMoneyInput(expected)).toBe(cents);
  });
});

describe('formatMoney', () => {
  it('formats cents in the given currency and locale', () => {
    expect(formatMoney(150_000, 'MXN', 'es-MX')).toBe('$1,500.00');
    expect(formatMoney(150_050, 'USD', 'en-US')).toBe('$1,500.50');
  });
});

it('validates money input', () => {
  expect(isValidMoneyInput('10')).toBe(true);
  expect(isValidMoneyInput('10.123')).toBe(false);
});
