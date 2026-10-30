import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/button';
import { ErrorState } from '@/components/error-state';
import { LoadingScreen } from '@/components/loading-screen';
import { Screen } from '@/components/screen';
import { useActiveBudget } from '@/features/budgets/active-budget-provider';
import { BudgetListItem } from '@/features/budgets/components/budget-list-item';

export default function BudgetsScreen() {
  const { t } = useTranslation();
  const { budgets, activeBudget, isLoading, error, refetch, selectBudget } = useActiveBudget();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  const selectAndGoBack = async (budgetId: number) => {
    await selectBudget(budgetId);
    router.back();
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: t('budgets.title') }} />
      {budgets.map((budget) => (
        <BudgetListItem
          key={budget.id}
          budget={budget}
          isActive={budget.id === activeBudget?.id}
          onSelect={() => selectAndGoBack(budget.id)}
          onEdit={() => router.push({ pathname: '/budgets/[budgetId]/edit', params: { budgetId: budget.id } })}
        />
      ))}
      <Button title={t('budgets.new')} onPress={() => router.push('/budgets/new')} />
    </Screen>
  );
}
