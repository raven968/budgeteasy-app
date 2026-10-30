import { sharePercentage, spendingLevel } from '../spending';

describe('spendingLevel', () => {
  it.each([
    [0, 'success'],
    [79.99, 'success'],
    [80, 'warning'],
    [100, 'warning'],
    [100.01, 'error'],
    [250, 'error'],
  ])('%d%% is %s', (percentage, expected) => {
    expect(spendingLevel(percentage)).toBe(expected);
  });
});

describe('sharePercentage', () => {
  it('rounds the share and handles an empty total', () => {
    expect(sharePercentage(1, 3)).toBe(33);
    expect(sharePercentage(2, 3)).toBe(67);
    expect(sharePercentage(5, 0)).toBe(0);
  });
});
