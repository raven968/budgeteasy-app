import type { Budget } from '@/features/budgets/types';
import { apiClient } from '@/lib/api/client';

import type { BudgetInvitation, BudgetMember } from './types';

export async function fetchBudgetMembers(budgetId: number): Promise<BudgetMember[]> {
  const response = await apiClient.get<{ data: BudgetMember[] }>(`/budgets/${budgetId}/members`);

  return response.data.data;
}

export async function removeBudgetMember(budgetId: number, userId: number): Promise<void> {
  await apiClient.delete(`/budgets/${budgetId}/members/${userId}`);
}

export async function createInvitation(budgetId: number): Promise<BudgetInvitation> {
  const response = await apiClient.post<{ data: BudgetInvitation }>(`/budgets/${budgetId}/invitations`);

  return response.data.data;
}

/** Joins the budget of the code and returns it. */
export async function acceptInvitation(code: string): Promise<Budget> {
  const response = await apiClient.post<{ data: Budget }>('/invitations/accept', { code });

  return response.data.data;
}
