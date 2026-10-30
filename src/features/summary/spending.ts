import type { ThemeColors } from '@/lib/theme';

export type SpendingLevel = 'success' | 'warning' | 'error';

/** From this percentage of the budget the progress turns to warning. */
const WARNING_FROM_PERCENTAGE = 80;

/**
 * Under 80% of the budget is fine, from 80% up to 100% is a warning, over 100% is exceeded.
 */
export function spendingLevel(spentPercentage: number): SpendingLevel {
  if (spentPercentage > 100) {
    return 'error';
  }

  return spentPercentage >= WARNING_FROM_PERCENTAGE ? 'warning' : 'success';
}

export function spendingLevelColor(level: SpendingLevel, colors: ThemeColors): string {
  return colors[level];
}

/** Share of `part` in `total` as a whole percentage, 0 when the total is 0. */
export function sharePercentage(part: number, total: number): number {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}
