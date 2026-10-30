import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { CURRENCIES, type Currency } from '@/lib/money';

type CurrencyPickerProps = {
  label: string;
  value: Currency;
  onChange: (currency: Currency) => void;
  error?: string;
};

export function CurrencyPicker({ label, value, onChange, error }: CurrencyPickerProps) {
  const theme = useTheme();

  return (
    <View style={{ gap: theme.spacing.xs }}>
      <ThemedText variant="label">{label}</ThemedText>
      <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
        {CURRENCIES.map((currency) => {
          const isSelected = currency === value;

          return (
            <Pressable
              key={currency}
              accessibilityRole="radio"
              accessibilityState={{ selected: isSelected }}
              onPress={() => onChange(currency)}
              style={{
                borderRadius: theme.radius.field,
                borderWidth: theme.borderWidth,
                borderColor: isSelected ? theme.colors.primary : theme.colors.base300,
                backgroundColor: isSelected ? theme.colors.primary : theme.colors.base100,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.sm,
              }}>
              <ThemedText
                variant="label"
                style={{ color: isSelected ? theme.colors.primaryContent : theme.colors.baseContent }}>
                {currency}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
      {error ? (
        <ThemedText variant="caption" tone="error">
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}
