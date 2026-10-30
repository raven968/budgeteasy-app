import { useQuery } from '@tanstack/react-query';
import * as SecureStore from 'expo-secure-store';
import { createContext, type ReactNode, use } from 'react';

import { useAuth } from '@/features/auth/auth-provider';
import { queryClient } from '@/lib/query-client';

import { pickActiveBudget } from './active-budget';
import { useBudgets } from './hooks';
import type { Budget } from './types';

type ActiveBudgetContextValue = {
  activeBudget: Budget | null;
  budgets: Budget[];
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
  selectBudget: (budgetId: number) => Promise<void>;
};

const ActiveBudgetContext = createContext<ActiveBudgetContextValue | null>(null);

/** Stored per user so a shared device never shows another account's selection. */
function storageKey(userId: number): string {
  return `budgeteasy.active_budget.${userId}`;
}

function activeBudgetIdQueryKey(userId: number) {
  return ['active-budget-id', userId] as const;
}

async function loadStoredBudgetId(userId: number): Promise<number | null> {
  const storedValue = await SecureStore.getItemAsync(storageKey(userId));

  return storedValue ? Number(storedValue) : null;
}

export function ActiveBudgetProvider({ children }: { children: ReactNode }) {
  const { state } = useAuth();
  const userId = state.status === 'signedIn' ? state.user.id : 0;
  const budgetsQuery = useBudgets();
  const storedIdQuery = useQuery({
    queryKey: activeBudgetIdQueryKey(userId),
    queryFn: () => loadStoredBudgetId(userId),
    staleTime: Infinity,
  });

  const selectBudget = async (budgetId: number) => {
    await SecureStore.setItemAsync(storageKey(userId), String(budgetId));
    queryClient.setQueryData(activeBudgetIdQueryKey(userId), budgetId);
  };

  const budgets = budgetsQuery.data ?? [];

  return (
    <ActiveBudgetContext
      value={{
        activeBudget: pickActiveBudget(budgets, storedIdQuery.data ?? null),
        budgets,
        isLoading: budgetsQuery.isPending || storedIdQuery.isPending,
        error: budgetsQuery.error,
        refetch: () => void budgetsQuery.refetch(),
        selectBudget,
      }}>
      {children}
    </ActiveBudgetContext>
  );
}

export function useActiveBudget(): ActiveBudgetContextValue {
  const context = use(ActiveBudgetContext);

  if (!context) {
    throw new Error('useActiveBudget must be used inside <ActiveBudgetProvider>.');
  }

  return context;
}
