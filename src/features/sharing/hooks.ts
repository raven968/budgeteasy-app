import { useMutation, useQuery } from '@tanstack/react-query';

import { budgetsQueryKey } from '@/features/budgets/hooks';
import { queryClient } from '@/lib/query-client';

import { acceptInvitation, createInvitation, fetchBudgetMembers, removeBudgetMember } from './api';

export function budgetMembersQueryKey(budgetId: number) {
  return ['budget-members', budgetId] as const;
}

export function useBudgetMembers(budgetId: number) {
  return useQuery({
    queryKey: budgetMembersQueryKey(budgetId),
    queryFn: () => fetchBudgetMembers(budgetId),
  });
}

export function useCreateInvitation(budgetId: number) {
  return useMutation({ mutationFn: () => createInvitation(budgetId) });
}

export function useAcceptInvitation() {
  return useMutation({
    mutationFn: (code: string) => acceptInvitation(code),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: budgetsQueryKey }),
  });
}

/**
 * Removes a member (owner) or leaves the budget (member removing themselves).
 */
export function useRemoveMember(budgetId: number) {
  return useMutation({
    mutationFn: (userId: number) => removeBudgetMember(budgetId, userId),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: budgetMembersQueryKey(budgetId) }),
        queryClient.invalidateQueries({ queryKey: budgetsQueryKey }),
        queryClient.invalidateQueries({ queryKey: ['budget-summary', budgetId] }),
      ]),
  });
}
