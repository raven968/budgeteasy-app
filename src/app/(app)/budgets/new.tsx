import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Screen } from '@/components/screen';
import { useActiveBudget } from '@/features/budgets/active-budget-provider';
import { BudgetForm } from '@/features/budgets/components/budget-form';
import { getDefaultCurrency } from '@/features/budgets/default-currency';
import { useCreateBudget } from '@/features/budgets/hooks';
import type { BudgetPayload } from '@/features/budgets/types';

export default function NewBudgetScreen() {
  const { t } = useTranslation();
  const { selectBudget } = useActiveBudget();
  const createBudgetMutation = useCreateBudget();

  const createAndSelect = async (payload: BudgetPayload) => {
    const budget = await createBudgetMutation.mutateAsync(payload);
    await selectBudget(budget.id);
    router.dismissTo('/');
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: t('budgets.new') }} />
      <BudgetForm
        defaultValues={{ name: '', amount: '', currency: getDefaultCurrency() }}
        submitLabel={t('budgets.create')}
        isSubmitting={createBudgetMutation.isPending}
        onSubmit={createAndSelect}
      />
    </Screen>
  );
}
