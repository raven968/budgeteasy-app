import { type InfiniteData, useInfiniteQuery, useMutation } from '@tanstack/react-query';

import { queryClient } from '@/lib/query-client';

import { createExpense, deleteExpense, fetchExpensesPage, updateExpense } from './api';
import type { Expense, ExpenseFilters, ExpensePage, ExpensePayload } from './types';

export function expensesQueryKey(budgetId: number, filters?: ExpenseFilters) {
  return filters ? (['expenses', budgetId, filters] as const) : (['expenses', budgetId] as const);
}

export function useExpenses(budgetId: number, filters: ExpenseFilters) {
  return useInfiniteQuery({
    queryKey: expensesQueryKey(budgetId, filters),
    queryFn: ({ pageParam }) => fetchExpensesPage(budgetId, filters, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.current_page < lastPage.meta.last_page ? lastPage.meta.current_page + 1 : undefined,
  });
}

/**
 * An expense already loaded in any list of the budget. There is no single-expense endpoint;
 * the edit screen is always opened from a list.
 */
export function findCachedExpense(budgetId: number, expenseId: number): Expense | undefined {
  const cachedLists = queryClient.getQueriesData<InfiniteData<ExpensePage>>({ queryKey: expensesQueryKey(budgetId) });

  for (const [, data] of cachedLists) {
    const expense = data?.pages.flatMap((page) => page.data).find((item) => item.id === expenseId);

    if (expense) {
      return expense;
    }
  }

  return undefined;
}

/** Expenses change the lists and the monthly summary of the budget. */
function invalidateBudgetSpending(budgetId: number) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: expensesQueryKey(budgetId) }),
    queryClient.invalidateQueries({ queryKey: ['budget-summary', budgetId] }),
  ]);
}

export function useCreateExpense(budgetId: number) {
  return useMutation({
    mutationFn: (payload: ExpensePayload) => createExpense(budgetId, payload),
    onSuccess: () => invalidateBudgetSpending(budgetId),
  });
}

export function useUpdateExpense(budgetId: number, expenseId: number) {
  return useMutation({
    mutationFn: (payload: Partial<ExpensePayload>) => updateExpense(expenseId, payload),
    onSuccess: () => invalidateBudgetSpending(budgetId),
  });
}

export function useDeleteExpense(budgetId: number) {
  return useMutation({
    mutationFn: (expenseId: number) => deleteExpense(expenseId),
    onSuccess: () => invalidateBudgetSpending(budgetId),
  });
}
