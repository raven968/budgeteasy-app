import type { BudgetRole } from '@/features/budgets/types';

import type { Expense } from './types';

/**
 * Mirrors the API rule: the author or the budget owner can edit and delete an expense.
 */
export function canManageExpense(expense: Expense, userId: number, budgetRole: BudgetRole): boolean {
  return budgetRole === 'owner' || expense.user?.id === userId;
}
