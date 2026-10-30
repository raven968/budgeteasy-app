import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { ErrorState } from '@/components/error-state';
import { LoadingScreen } from '@/components/loading-screen';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/features/auth/auth-provider';
import { useActiveBudget } from '@/features/budgets/active-budget-provider';
import type { Budget } from '@/features/budgets/types';
import { MonthSwitcher } from '@/features/expenses/components/month-switcher';
import { BudgetSummarySection } from '@/features/summary/components/budget-summary-section';
import { useBudgetSummary } from '@/features/summary/hooks';
import { useTheme } from '@/hooks/use-theme';
import { currentMonth } from '@/lib/dates';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const { activeBudget, isLoading, error, refetch } = useActiveBudget();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  if (!activeBudget) {
    return (
      <Screen centered>
        <Card>
          <ThemedText variant="subtitle">{t('budgets.empty.title')}</ThemedText>
          <ThemedText tone="muted">{t('budgets.empty.message')}</ThemedText>
          <Button title={t('budgets.create')} onPress={() => router.push('/budgets/new')} />
        </Card>
        <Button title={t('auth.signOut')} variant="ghost" onPress={signOut} />
      </Screen>
    );
  }

  return <BudgetHome budget={activeBudget} />;
}

function BudgetHome({ budget }: { budget: Budget }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const { state, signOut } = useAuth();
  const userId = state.status === 'signedIn' ? state.user.id : 0;
  const [month, setMonth] = useState(currentMonth());
  const summaryQuery = useBudgetSummary(budget.id, month);

  return (
    <Screen onRefresh={() => summaryQuery.refetch()} isRefreshing={summaryQuery.isRefetching}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.sm }}>
        <View style={{ flexShrink: 1, gap: theme.spacing.xs }}>
          <ThemedText variant="title" numberOfLines={1}>
            {budget.name}
          </ThemedText>
          <Badge
            label={
              budget.role === 'owner'
                ? t('budgets.roles.owner')
                : t('budgets.roles.member', { owner: budget.owner.name })
            }
            variant="outline"
          />
        </View>
        <Button title={t('budgets.switch')} variant="ghost" onPress={() => router.push('/budgets')} />
      </View>

      <MonthSwitcher month={month} onChange={setMonth} />

      <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
        <View style={{ flex: 1 }}>
          <Button title={t('expenses.new')} onPress={() => router.push('/expenses/new')} />
        </View>
        <View style={{ flex: 1 }}>
          <Button title={t('expenses.viewAll')} variant="outline" onPress={() => router.push('/expenses')} />
        </View>
      </View>

      <BudgetSummarySection summaryQuery={summaryQuery} currentUserId={userId} />

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: theme.spacing.sm }}>
        <Button title={t('categories.manage')} variant="ghost" onPress={() => router.push('/categories')} />
        <Button title={t('auth.signOut')} variant="ghost" onPress={signOut} />
      </View>
    </Screen>
  );
}
