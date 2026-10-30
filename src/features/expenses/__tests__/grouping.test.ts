import { groupExpensesByDay } from '../grouping';
import type { Expense } from '../types';

function expense(id: number, spentOn: string, amount: number): Expense {
  return {
    id,
    budget_id: 1,
    amount,
    spent_on: spentOn,
    note: null,
    category: {
      id: 1,
      name: 'Súper',
      icon: 'cart',
      color: '#5E81AC',
      is_deleted: false,
      created_at: '',
      updated_at: '',
    },
    user: { id: 1, name: 'Aron' },
    created_at: '',
    updated_at: '',
  };
}

it('groups consecutive expenses by day with the day total', () => {
  const sections = groupExpensesByDay([
    expense(3, '2026-10-29', 10_000),
    expense(2, '2026-10-29', 2_550),
    expense(1, '2026-10-27', 99),
  ]);

  expect(sections.map(({ day, total, data }) => ({ day, total, ids: data.map((item) => item.id) }))).toEqual([
    { day: '2026-10-29', total: 12_550, ids: [3, 2] },
    { day: '2026-10-27', total: 99, ids: [1] },
  ]);
});

it('returns no sections without expenses', () => {
  expect(groupExpensesByDay([])).toEqual([]);
});
