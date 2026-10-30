import { apiClient } from '@/lib/api/client';

import type { Category, CategoryList, CategoryPayload } from './types';

export async function fetchCategories(): Promise<CategoryList> {
  const response = await apiClient.get<CategoryList>('/categories');

  return response.data;
}

export async function createCategory(payload: CategoryPayload): Promise<Category> {
  const response = await apiClient.post<{ data: Category }>('/categories', payload);

  return response.data.data;
}

export async function updateCategory(categoryId: number, payload: Partial<CategoryPayload>): Promise<Category> {
  const response = await apiClient.put<{ data: Category }>(`/categories/${categoryId}`, payload);

  return response.data.data;
}

export async function deleteCategory(categoryId: number): Promise<void> {
  await apiClient.delete(`/categories/${categoryId}`);
}

/** Categories usable in a budget: its owner's active categories. */
export async function fetchBudgetCategories(budgetId: number): Promise<Category[]> {
  const response = await apiClient.get<{ data: Category[] }>(`/budgets/${budgetId}/categories`);

  return response.data.data;
}
