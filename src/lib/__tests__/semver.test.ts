import { compareVersions } from '@/lib/semver';

describe('compareVersions', () => {
  it.each([
    ['0.1.0', '0.1.0', 0],
    ['0.1.0', '0.2.0', -1],
    ['1.0.0', '0.9.9', 1],
    ['1.10.0', '1.9.0', 1],
    ['1.0.0-beta.1', '1.0.0', 0],
    ['1.2', '1.2.0', 0],
  ])('compares %s with %s', (a, b, expected) => {
    expect(Math.sign(compareVersions(a, b))).toBe(expected);
  });
});
