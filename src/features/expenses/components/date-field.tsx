import { DateTimePicker } from '@expo/ui/community/datetime-picker';
import { useState } from 'react';
import { Platform, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Chip } from '@/components/chip';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { formatShortDate, parseDateString, toDateString, todayString, yesterdayString } from '@/lib/dates';

type DateFieldProps = {
  label: string;
  /** `YYYY-MM-DD` */
  value: string;
  onChange: (value: string) => void;
};

/**
 * Quick "Today"/"Yesterday" choices plus the native picker for any other past date.
 * iOS shows a compact picker inline; Android opens its dialog on demand.
 */
export function DateField({ label, value, onChange }: DateFieldProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [isAndroidDialogOpen, setIsAndroidDialogOpen] = useState(false);
  const today = todayString();
  const yesterday = yesterdayString();
  const isOtherDate = value !== today && value !== yesterday;
  const isIos = Platform.OS === 'ios';

  const selectDate = (date: Date) => {
    setIsAndroidDialogOpen(false);
    onChange(toDateString(date));
  };

  return (
    <View style={{ gap: theme.spacing.xs }}>
      <ThemedText variant="label">{label}</ThemedText>
      <View
        accessibilityRole="radiogroup"
        style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: theme.spacing.sm }}>
        <Chip label={t('expenses.dates.today')} isSelected={value === today} onPress={() => onChange(today)} />
        <Chip
          label={t('expenses.dates.yesterday')}
          isSelected={value === yesterday}
          onPress={() => onChange(yesterday)}
        />
        {isIos ? (
          <DateTimePicker
            value={parseDateString(value)}
            mode="date"
            display="compact"
            maximumDate={new Date()}
            accentColor={theme.colors.primary}
            onValueChange={(_, date) => selectDate(date)}
          />
        ) : (
          <Chip
            label={isOtherDate ? formatShortDate(value) : t('expenses.dates.other')}
            isSelected={isOtherDate}
            onPress={() => setIsAndroidDialogOpen(true)}
          />
        )}
      </View>
      {!isIos && isAndroidDialogOpen ? (
        <DateTimePicker
          value={parseDateString(value)}
          mode="date"
          presentation="dialog"
          maximumDate={new Date()}
          accentColor={theme.colors.primary}
          onValueChange={(_, date) => selectDate(date)}
          onDismiss={() => setIsAndroidDialogOpen(false)}
        />
      ) : null}
    </View>
  );
}
