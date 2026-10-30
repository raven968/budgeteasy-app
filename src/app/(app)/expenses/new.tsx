import { Redirect, router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { ErrorState } from '@/components/error-state';
import { LoadingScreen } from '@/components/loading-screen';
import { Screen } from '@/components/screen';
import { useActiveBudget } from '@/features/budgets/active-budget-provider';
import type { Budget } from '@/features/budgets/types';
import { useBudgetCategories } from '@/features/categories/hooks';
import { ExpenseForm } from '@/features/expenses/components/expense-form';
import { NoCategoriesNotice } from '@/features/expenses/components/no-categories-notice';
import { useCreateExpense } from '@/features/expenses/hooks';
import type { ExpensePayload } from '@/features/expenses/types';
import { todayString } from '@/lib/dates';

export default function NewExpenseScreen() {
  const { activeBudget, isLoading } = useActiveBudget();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!activeBudget) {
    return <Redirect href="/" />;
  }

  return <NewExpense budget={activeBudget} />;
}

function NewExpense({ budget }: { budget: Budget }) {
  const { t } = useTranslation();
  const categoriesQuery = useBudgetCategories(budget.id);
  const createExpenseMutation = useCreateExpense(budget.id);

  if (categoriesQuery.isPending) {
    return <LoadingScreen />;
  }

  if (categoriesQuery.error) {
    return <ErrorState error={categoriesQuery.error} onRetry={() => categoriesQuery.refetch()} />;
  }

  const create = async (payload: ExpensePayload) => {
    await createExpenseMutation.mutateAsync(payload);
    router.back();
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: t('expenses.new') }} />
      {categoriesQuery.data.length === 0 ? (
        <NoCategoriesNotice isOwner={budget.role === 'owner'} />
      ) : (
        <ExpenseForm
          categories={categoriesQuery.data}
          currency={budget.currency}
          defaultValues={{ amount: '', category_id: undefined, spent_on: todayString(), note: '' }}
          submitLabel={t('expenses.save')}
          isSubmitting={createExpenseMutation.isPending}
          autoFocusAmount
          onSubmit={create}
        />
      )}
    </Screen>
  );
}
