import { apiClient } from '@/lib/api/client';

import type { Budget, BudgetPayload } from './types';

export async function fetchBudgets(): Promise<Budget[]> {
  const response = await apiClient.get<{ data: Budget[] }>('/budgets');

  return response.data.data;
}

export async function createBudget(payload: BudgetPayload): Promise<Budget> {
  const response = await apiClient.post<{ data: Budget }>('/budgets', payload);

  return response.data.data;
}

export async function updateBudget(budgetId: number, payload: Partial<BudgetPayload>): Promise<Budget> {
  const response = await apiClient.put<{ data: Budget }>(`/budgets/${budgetId}`, payload);

  return response.data.data;
}

export async function deleteBudget(budgetId: number): Promise<void> {
  await apiClient.delete(`/budgets/${budgetId}`);
}
