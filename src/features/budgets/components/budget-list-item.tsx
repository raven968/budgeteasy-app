import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { formatMoney } from '@/lib/money';

import type { Budget } from '../types';

type BudgetListItemProps = {
  budget: Budget;
  isActive: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onShare: () => void;
};

export function BudgetListItem({ budget, isActive, onSelect, onEdit, onShare }: BudgetListItemProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isOwner = budget.role === 'owner';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
      onPress={onSelect}
      style={({ pressed }) => ({
        backgroundColor: theme.colors.base100,
        borderColor: isActive ? theme.colors.primary : theme.colors.base300,
        borderWidth: isActive ? 2 : theme.borderWidth,
        borderRadius: theme.radius.box,
        padding: theme.spacing.lg,
        gap: theme.spacing.sm,
        opacity: pressed ? 0.85 : 1,
      })}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.sm }}>
        <ThemedText variant="subtitle" style={{ flexShrink: 1 }}>
          {budget.name}
        </ThemedText>
        {isActive ? <Badge label={t('budgets.active')} variant="primary" /> : null}
      </View>
      <ThemedText tone="muted">
        {t('budgets.monthlyAmount', { amount: formatMoney(budget.amount, budget.currency) })}
      </ThemedText>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Badge
          label={isOwner ? t('budgets.roles.owner') : t('budgets.roles.member', { owner: budget.owner.name })}
          variant="outline"
        />
        <View style={{ flexDirection: 'row' }}>
          <Button title={t('sharing.manage')} variant="ghost" onPress={onShare} />
          {isOwner ? <Button title={t('common.edit')} variant="ghost" onPress={onEdit} /> : null}
        </View>
      </View>
    </Pressable>
  );
}
