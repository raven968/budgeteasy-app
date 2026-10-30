import { useMutation, useQuery } from '@tanstack/react-query';

import { queryClient } from '@/lib/query-client';

import { createCategory, deleteCategory, fetchBudgetCategories, fetchCategories, updateCategory } from './api';
import type { CategoryPayload } from './types';

export const categoriesQueryKey = ['categories'] as const;

export function budgetCategoriesQueryKey(budgetId: number) {
  return ['budget-categories', budgetId] as const;
}

export function useCategories() {
  return useQuery({ queryKey: categoriesQueryKey, queryFn: fetchCategories });
}

export function useBudgetCategories(budgetId: number) {
  return useQuery({
    queryKey: budgetCategoriesQueryKey(budgetId),
    queryFn: () => fetchBudgetCategories(budgetId),
  });
}

/** The user's categories feed every budget they own, so both lists are refreshed. */
function invalidateCategories() {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: categoriesQueryKey }),
    queryClient.invalidateQueries({ queryKey: ['budget-categories'] }),
  ]);
}

export function useCreateCategory() {
  return useMutation({
    mutationFn: (payload: CategoryPayload) => createCategory(payload),
    onSuccess: invalidateCategories,
  });
}

export function useUpdateCategory(categoryId: number) {
  return useMutation({
    mutationFn: (payload: Partial<CategoryPayload>) => updateCategory(categoryId, payload),
    onSuccess: invalidateCategories,
  });
}

export function useDeleteCategory() {
  return useMutation({
    mutationFn: (categoryId: number) => deleteCategory(categoryId),
    onSuccess: invalidateCategories,
  });
}
