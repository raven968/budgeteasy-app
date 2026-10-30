import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/card';
import { ProgressBar } from '@/components/progress-bar';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { formatMoney } from '@/lib/money';

import { spendingLevel, spendingLevelColor } from '../spending';
import type { BudgetSummary } from '../types';

type SpendingOverviewProps = {
  summary: BudgetSummary;
};

export function SpendingOverview({ summary }: SpendingOverviewProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const level = spendingLevel(summary.spent_percentage);
  const isOverBudget = summary.remaining_amount < 0;
  const money = (cents: number) => formatMoney(cents, summary.currency);

  return (
    <Card>
      <View style={{ gap: theme.spacing.xs }}>
        <ThemedText tone="muted">{t('summary.spent')}</ThemedText>
        <ThemedText variant="title">{money(summary.spent_amount)}</ThemedText>
        <ThemedText tone="muted">{t('summary.ofBudget', { amount: money(summary.budget_amount) })}</ThemedText>
      </View>

      <ProgressBar
        percentage={summary.spent_percentage}
        color={spendingLevelColor(level, theme.colors)}
        height={14}
        accessibilityLabel={t('summary.progressLabel', { percentage: Math.round(summary.spent_percentage) })}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: theme.spacing.sm }}>
        <ThemedText variant="label" tone={isOverBudget ? 'error' : 'default'} style={{ flexShrink: 1 }}>
          {isOverBudget
            ? t('summary.overBudget', { amount: money(Math.abs(summary.remaining_amount)) })
            : t('summary.remaining', { amount: money(summary.remaining_amount) })}
        </ThemedText>
        <ThemedText variant="label" tone="muted">
          {t('summary.percentage', { percentage: Math.round(summary.spent_percentage) })}
        </ThemedText>
      </View>
    </Card>
  );
}
