/**
 * Compares two `MAJOR.MINOR.PATCH` versions. Returns a negative number when `a < b`,
 * zero when equal and a positive number when `a > b`. Pre-release suffixes are ignored.
 */
export function compareVersions(a: string, b: string): number {
  const partsA = parseVersion(a);
  const partsB = parseVersion(b);

  for (let index = 0; index < 3; index++) {
    const difference = partsA[index] - partsB[index];

    if (difference !== 0) {
      return difference;
    }
  }

  return 0;
}

function parseVersion(version: string): [number, number, number] {
  const [major = 0, minor = 0, patch = 0] = version
    .split('-')[0]
    .split('.')
    .map((part) => Number.parseInt(part, 10) || 0);

  return [major, minor, patch];
}
