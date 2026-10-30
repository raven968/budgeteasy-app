import { canManageExpense } from '../permissions';
import type { Expense } from '../types';

function expenseBy(user: Expense['user']): Expense {
  return { user } as Expense;
}

it('lets the author manage their expense', () => {
  expect(canManageExpense(expenseBy({ id: 2, name: 'Esposa' }), 2, 'member')).toBe(true);
});

it('lets the budget owner manage any expense', () => {
  expect(canManageExpense(expenseBy({ id: 2, name: 'Esposa' }), 1, 'owner')).toBe(true);
  expect(canManageExpense(expenseBy(null), 1, 'owner')).toBe(true);
});

it('prevents other members from managing it', () => {
  expect(canManageExpense(expenseBy({ id: 1, name: 'Aron' }), 2, 'member')).toBe(false);
  expect(canManageExpense(expenseBy(null), 2, 'member')).toBe(false);
});
