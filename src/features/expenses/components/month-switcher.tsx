import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/button';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { currentMonth, formatMonthLabel, shiftMonth } from '@/lib/dates';

type MonthSwitcherProps = {
  /** `YYYY-MM` */
  month: string;
  onChange: (month: string) => void;
};

export function MonthSwitcher({ month, onChange }: MonthSwitcherProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isCurrentMonth = month === currentMonth();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: theme.spacing.sm }}>
      <Button
        title="‹"
        accessibilityLabel={t('expenses.previousMonth')}
        variant="ghost"
        onPress={() => onChange(shiftMonth(month, -1))}
      />
      <ThemedText
        variant="subtitle"
        accessibilityRole="header"
        style={{ flex: 1, textAlign: 'center', textTransform: 'capitalize' }}>
        {formatMonthLabel(month)}
      </ThemedText>
      <Button
        title="›"
        accessibilityLabel={t('expenses.nextMonth')}
        variant="ghost"
        disabled={isCurrentMonth}
        onPress={() => onChange(shiftMonth(month, 1))}
      />
    </View>
  );
}
