import { apiClient } from '@/lib/api/client';

import type { BudgetSummary } from './types';

export async function fetchBudgetSummary(budgetId: number, month: string): Promise<BudgetSummary> {
  const response = await apiClient.get<{ data: BudgetSummary }>(`/budgets/${budgetId}/summary`, {
    params: { month },
  });

  return response.data.data;
}
