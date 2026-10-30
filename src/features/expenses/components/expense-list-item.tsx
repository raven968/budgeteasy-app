import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { CategoryIcon } from '@/features/categories/components/category-icon';
import { useTheme } from '@/hooks/use-theme';
import { formatMoney } from '@/lib/money';

import type { Expense } from '../types';

type ExpenseListItemProps = {
  expense: Expense;
  currency: string;
  /** Present only when the user can edit the expense. */
  onPress?: () => void;
};

export function ExpenseListItem({ expense, currency, onPress }: ExpenseListItemProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const authorName = expense.user?.name ?? t('expenses.deletedUser');

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
        backgroundColor: theme.colors.base100,
        borderRadius: theme.radius.field,
        padding: theme.spacing.md,
        opacity: pressed ? 0.85 : 1,
      })}>
      <CategoryIcon icon={expense.category.icon} color={expense.category.color} />
      <View style={{ flex: 1, gap: 2 }}>
        <ThemedText variant="label" numberOfLines={1}>
          {expense.category.name}
        </ThemedText>
        <ThemedText variant="caption" tone="muted" numberOfLines={1}>
          {expense.note ? `${authorName} · ${expense.note}` : authorName}
        </ThemedText>
      </View>
      <ThemedText variant="label">{formatMoney(expense.amount, currency)}</ThemedText>
    </Pressable>
  );
}
