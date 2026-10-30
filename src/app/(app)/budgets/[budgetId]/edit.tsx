import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/button';
import { ErrorState } from '@/components/error-state';
import { LoadingScreen } from '@/components/loading-screen';
import { Screen } from '@/components/screen';
import { BudgetForm } from '@/features/budgets/components/budget-form';
import { useBudget, useDeleteBudget, useUpdateBudget } from '@/features/budgets/hooks';
import type { BudgetPayload } from '@/features/budgets/types';
import { getErrorMessage } from '@/lib/api/errors';
import { centsToMoneyInput, CURRENCIES, type Currency } from '@/lib/money';

export default function EditBudgetScreen() {
  const { t } = useTranslation();
  const { budgetId } = useLocalSearchParams<{ budgetId: string }>();
  const { data: budget, isPending, error, refetch } = useBudget(Number(budgetId));
  const updateBudgetMutation = useUpdateBudget(Number(budgetId));
  const deleteBudgetMutation = useDeleteBudget();

  if (isPending) {
    return <LoadingScreen />;
  }

  if (error || !budget) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const update = async (payload: BudgetPayload) => {
    await updateBudgetMutation.mutateAsync(payload);
    router.back();
  };

  const confirmDelete = () => {
    Alert.alert(t('budgets.delete.title'), t('budgets.delete.message', { name: budget.name }), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () =>
          deleteBudgetMutation
            .mutateAsync(budget.id)
            .then(() => router.dismissTo('/budgets'))
            .catch((deleteError: unknown) => Alert.alert(getErrorMessage(deleteError))),
      },
    ]);
  };

  const currency = CURRENCIES.find((code) => code === budget.currency) ?? ('MXN' satisfies Currency);

  return (
    <Screen>
      <Stack.Screen options={{ title: t('budgets.edit') }} />
      <BudgetForm
        defaultValues={{ name: budget.name, amount: centsToMoneyInput(budget.amount), currency }}
        submitLabel={t('common.save')}
        isSubmitting={updateBudgetMutation.isPending}
        onSubmit={update}
      />
      <Button
        title={t('common.delete')}
        variant="ghost"
        onPress={confirmDelete}
        isLoading={deleteBudgetMutation.isPending}
      />
    </Screen>
  );
}
