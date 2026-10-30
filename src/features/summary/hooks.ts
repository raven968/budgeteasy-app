import { useQuery } from '@tanstack/react-query';

import { fetchBudgetSummary } from './api';

/** Prefix shared with the expense mutations, which invalidate `['budget-summary', budgetId]`. */
export function budgetSummaryQueryKey(budgetId: number, month: string) {
  return ['budget-summary', budgetId, month] as const;
}

export function useBudgetSummary(budgetId: number, month: string) {
  return useQuery({
    queryKey: budgetSummaryQueryKey(budgetId, month),
    queryFn: () => fetchBudgetSummary(budgetId, month),
  });
}
