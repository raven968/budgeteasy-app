import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/card';
import { ProgressBar } from '@/components/progress-bar';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { formatMoney } from '@/lib/money';

import { sharePercentage } from '../spending';
import type { BudgetSummary } from '../types';

type MemberBreakdownProps = {
  summary: BudgetSummary;
  currentUserId: number;
};

/**
 * Who spent how much. Only meaningful in shared budgets, so the caller hides it when the
 * summary has a single member.
 */
export function MemberBreakdown({ summary, currentUserId }: MemberBreakdownProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Card>
      <ThemedText variant="subtitle">{t('summary.byMember')}</ThemedText>
      {summary.members.map((row) => {
        const name = !row.user
          ? t('expenses.deletedUser')
          : row.user.id === currentUserId
            ? t('summary.you', { name: row.user.name })
            : row.user.name;
        const share = sharePercentage(row.spent_amount, summary.spent_amount);

        return (
          <View key={row.user?.id ?? 'deleted'} style={{ gap: theme.spacing.xs }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: theme.spacing.sm }}>
              <ThemedText variant="label" numberOfLines={1} style={{ flexShrink: 1 }}>
                {name}
              </ThemedText>
              <ThemedText variant="label">
                {formatMoney(row.spent_amount, summary.currency)} · {t('summary.percentage', { percentage: share })}
              </ThemedText>
            </View>
            <ProgressBar percentage={share} color={theme.colors.secondary} height={6} />
          </View>
        );
      })}
    </Card>
  );
}
