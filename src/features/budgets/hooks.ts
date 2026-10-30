import { useMutation, useQuery } from '@tanstack/react-query';

import { queryClient } from '@/lib/query-client';

import { createBudget, deleteBudget, fetchBudgets, updateBudget } from './api';
import type { BudgetPayload } from './types';

export const budgetsQueryKey = ['budgets'] as const;

export function useBudgets() {
  return useQuery({ queryKey: budgetsQueryKey, queryFn: fetchBudgets });
}

/** A budget from the cached list; budgets are few, so there is no per-budget request. */
export function useBudget(budgetId: number) {
  const budgetsQuery = useBudgets();

  return { ...budgetsQuery, data: budgetsQuery.data?.find((budget) => budget.id === budgetId) };
}

function invalidateBudgets() {
  return queryClient.invalidateQueries({ queryKey: budgetsQueryKey });
}

export function useCreateBudget() {
  return useMutation({
    mutationFn: (payload: BudgetPayload) => createBudget(payload),
    onSuccess: invalidateBudgets,
  });
}

export function useUpdateBudget(budgetId: number) {
  return useMutation({
    mutationFn: (payload: Partial<BudgetPayload>) => updateBudget(budgetId, payload),
    onSuccess: invalidateBudgets,
  });
}

export function useDeleteBudget() {
  return useMutation({
    mutationFn: (budgetId: number) => deleteBudget(budgetId),
    onSuccess: invalidateBudgets,
  });
}
