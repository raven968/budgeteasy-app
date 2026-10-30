import { ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { getErrorMessage } from '@/lib/api/errors';

import type { useBudgetSummary } from '../hooks';
import { CategoryBreakdown } from './category-breakdown';
import { MemberBreakdown } from './member-breakdown';
import { SpendingOverview } from './spending-overview';

type BudgetSummarySectionProps = {
  summaryQuery: ReturnType<typeof useBudgetSummary>;
  currentUserId: number;
};

/**
 * The monthly summary with its own loading and error states, so the rest of the home
 * (budget switcher, actions) stays usable.
 */
export function BudgetSummarySection({ summaryQuery, currentUserId }: BudgetSummarySectionProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  if (summaryQuery.isPending) {
    return (
      <Card>
        <ActivityIndicator color={theme.colors.primary} />
      </Card>
    );
  }

  if (summaryQuery.error) {
    return (
      <Card>
        <ThemedText tone="muted">{getErrorMessage(summaryQuery.error)}</ThemedText>
        <Button title={t('common.retry')} variant="outline" onPress={() => summaryQuery.refetch()} />
      </Card>
    );
  }

  const summary = summaryQuery.data;

  return (
    <>
      <SpendingOverview summary={summary} />
      <CategoryBreakdown summary={summary} />
      {summary.members.length > 1 ? <MemberBreakdown summary={summary} currentUserId={currentUserId} /> : null}
    </>
  );
}
