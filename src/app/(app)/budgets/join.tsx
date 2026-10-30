import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Screen } from '@/components/screen';
import { useActiveBudget } from '@/features/budgets/active-budget-provider';
import type { Budget } from '@/features/budgets/types';
import { JoinBudgetForm } from '@/features/sharing/components/join-budget-form';

export default function JoinBudgetScreen() {
  const { t } = useTranslation();
  const { selectBudget } = useActiveBudget();

  const openJoinedBudget = async (budget: Budget) => {
    await selectBudget(budget.id);
    router.dismissTo('/');
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: t('sharing.join.title') }} />
      <JoinBudgetForm onJoined={openJoinedBudget} />
    </Screen>
  );
}
