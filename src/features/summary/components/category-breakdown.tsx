import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/card';
import { ProgressBar } from '@/components/progress-bar';
import { ThemedText } from '@/components/themed-text';
import { CategoryIcon } from '@/features/categories/components/category-icon';
import { useTheme } from '@/hooks/use-theme';
import { formatMoney } from '@/lib/money';

import { sharePercentage } from '../spending';
import type { BudgetSummary } from '../types';

type CategoryBreakdownProps = {
  summary: BudgetSummary;
};

/**
 * Spending per category, highest first (the API already sorts it). Categories without
 * spending are summarized in a single line to keep the list short.
 */
export function CategoryBreakdown({ summary }: CategoryBreakdownProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const rowsWithSpending = summary.categories.filter((row) => row.spent_amount > 0);
  const unusedCount = summary.categories.length - rowsWithSpending.length;

  return (
    <Card>
      <ThemedText variant="subtitle">{t('summary.byCategory')}</ThemedText>

      {rowsWithSpending.length === 0 ? <ThemedText tone="muted">{t('summary.noSpending')}</ThemedText> : null}

      {rowsWithSpending.map((row) => {
        const share = sharePercentage(row.spent_amount, summary.spent_amount);

        return (
          <View key={row.category.id} style={{ gap: theme.spacing.xs }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
              <CategoryIcon icon={row.category.icon} color={row.category.color} size={32} />
              <View style={{ flex: 1 }}>
                <ThemedText variant="label" numberOfLines={1}>
                  {row.category.name}
                </ThemedText>
                <ThemedText variant="caption" tone="muted">
                  {t('summary.expensesCount', { count: row.expenses_count })}
                </ThemedText>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <ThemedText variant="label">{formatMoney(row.spent_amount, summary.currency)}</ThemedText>
                <ThemedText variant="caption" tone="muted">
                  {t('summary.percentage', { percentage: share })}
                </ThemedText>
              </View>
            </View>
            <ProgressBar percentage={share} color={row.category.color} height={6} />
          </View>
        );
      })}

      {unusedCount > 0 ? (
        <ThemedText variant="caption" tone="muted">
          {t('summary.unusedCategories', { count: unusedCount })}
        </ThemedText>
      ) : null}
    </Card>
  );
}
