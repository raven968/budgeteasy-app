import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/button';
import { ErrorState } from '@/components/error-state';
import { LoadingScreen } from '@/components/loading-screen';
import { Screen } from '@/components/screen';
import { useActiveBudget } from '@/features/budgets/active-budget-provider';
import { useBudgetCategories } from '@/features/categories/hooks';
import { ExpenseForm } from '@/features/expenses/components/expense-form';
import { findCachedExpense, useDeleteExpense, useUpdateExpense } from '@/features/expenses/hooks';
import type { ExpensePayload } from '@/features/expenses/types';
import { getErrorMessage } from '@/lib/api/errors';
import { centsToMoneyInput } from '@/lib/money';

export default function EditExpenseScreen() {
  const { t } = useTranslation();
  const { expenseId } = useLocalSearchParams<{ expenseId: string }>();
  const { activeBudget } = useActiveBudget();
  const budgetId = activeBudget?.id ?? 0;
  const expense = findCachedExpense(budgetId, Number(expenseId));
  const categoriesQuery = useBudgetCategories(budgetId);
  const updateExpenseMutation = useUpdateExpense(budgetId, Number(expenseId));
  const deleteExpenseMutation = useDeleteExpense(budgetId);

  if (categoriesQuery.isPending) {
    return <LoadingScreen />;
  }

  if (!activeBudget || !expense || categoriesQuery.error) {
    return <ErrorState error={categoriesQuery.error} onRetry={() => router.back()} />;
  }

  // A deleted category stays selectable for the expense that already uses it.
  const categories = categoriesQuery.data.some((category) => category.id === expense.category.id)
    ? categoriesQuery.data
    : [...categoriesQuery.data, expense.category];

  const update = async (payload: ExpensePayload) => {
    await updateExpenseMutation.mutateAsync(payload);
    router.back();
  };

  const confirmDelete = () => {
    Alert.alert(t('expenses.delete.title'), t('expenses.delete.message'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () =>
          deleteExpenseMutation
            .mutateAsync(expense.id)
            .then(() => router.back())
            .catch((deleteError: unknown) => Alert.alert(getErrorMessage(deleteError))),
      },
    ]);
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: t('expenses.edit') }} />
      <ExpenseForm
        categories={categories}
        currency={activeBudget.currency}
        defaultValues={{
          amount: centsToMoneyInput(expense.amount),
          category_id: expense.category.id,
          spent_on: expense.spent_on,
          note: expense.note ?? '',
        }}
        submitLabel={t('common.save')}
        isSubmitting={updateExpenseMutation.isPending}
        onSubmit={update}
      />
      <Button
        title={t('common.delete')}
        variant="ghost"
        onPress={confirmDelete}
        isLoading={deleteExpenseMutation.isPending}
      />
    </Screen>
  );
}
