import { apiClient } from '@/lib/api/client';

import type { Expense, ExpenseFilters, ExpensePage, ExpensePayload } from './types';

export async function fetchExpensesPage(budgetId: number, filters: ExpenseFilters, page: number): Promise<ExpensePage> {
  const response = await apiClient.get<ExpensePage>(`/budgets/${budgetId}/expenses`, {
    params: { ...filters, page },
  });

  return response.data;
}

export async function createExpense(budgetId: number, payload: ExpensePayload): Promise<Expense> {
  const response = await apiClient.post<{ data: Expense }>(`/budgets/${budgetId}/expenses`, payload);

  return response.data.data;
}

export async function updateExpense(expenseId: number, payload: Partial<ExpensePayload>): Promise<Expense> {
  const response = await apiClient.put<{ data: Expense }>(`/expenses/${expenseId}`, payload);

  return response.data.data;
}

export async function deleteExpense(expenseId: number): Promise<void> {
  await apiClient.delete(`/expenses/${expenseId}`);
}
