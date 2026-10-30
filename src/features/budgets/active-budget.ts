import type { Budget } from './types';

/**
 * The stored budget when it is still available, otherwise the first one (the API sorts
 * by name). Null when the user has no budgets.
 */
export function pickActiveBudget(budgets: Budget[], storedBudgetId: number | null): Budget | null {
  return budgets.find((budget) => budget.id === storedBudgetId) ?? budgets[0] ?? null;
}
