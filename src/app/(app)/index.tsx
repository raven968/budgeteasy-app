import { router } from 'expo-router';
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
import { formatMoney } from '@/lib/money';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { state, signOut } = useAuth();
  const { activeBudget, isLoading, error, refetch } = useActiveBudget();
  const userName = state.status === 'signedIn' ? state.user.name : '';

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  return (
    <Screen>
      <ThemedText variant="title">{t('home.greeting', { name: userName })}</ThemedText>

      {activeBudget ? (
        <Card>
          <ThemedText variant="subtitle">{activeBudget.name}</ThemedText>
          <Badge
            label={
              activeBudget.role === 'owner'
                ? t('budgets.roles.owner')
                : t('budgets.roles.member', { owner: activeBudget.owner.name })
            }
            variant="outline"
          />
          <ThemedText tone="muted">{t('budgets.monthlyBudget')}</ThemedText>
          <ThemedText variant="title">{formatMoney(activeBudget.amount, activeBudget.currency)}</ThemedText>
          <ThemedText tone="muted">{t('budgets.summaryComingSoon')}</ThemedText>
          <Button title={t('budgets.change')} variant="outline" onPress={() => router.push('/budgets')} />
        </Card>
      ) : (
        <Card>
          <ThemedText variant="subtitle">{t('budgets.empty.title')}</ThemedText>
          <ThemedText tone="muted">{t('budgets.empty.message')}</ThemedText>
          <Button title={t('budgets.create')} onPress={() => router.push('/budgets/new')} />
        </Card>
      )}

      <Button title={t('auth.signOut')} variant="ghost" onPress={signOut} />
    </Screen>
  );
}
