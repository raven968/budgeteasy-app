import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

import { CATEGORY_COLORS } from '../catalog';

type ColorPickerProps = {
  label: string;
  value: string;
  onChange: (color: string) => void;
};

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={{ gap: theme.spacing.xs }}>
      <ThemedText variant="label">{label}</ThemedText>
      <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
        {CATEGORY_COLORS.map((color, index) => {
          const isSelected = color.toLowerCase() === value.toLowerCase();

          return (
            <Pressable
              key={color}
              accessibilityRole="radio"
              accessibilityLabel={t('categories.colorOption', { number: index + 1 })}
              accessibilityState={{ selected: isSelected }}
              onPress={() => onChange(color)}
              style={{
                padding: 3,
                borderRadius: theme.radius.full,
                borderWidth: 2,
                borderColor: isSelected ? theme.colors.primary : 'transparent',
              }}>
              <View style={{ width: 32, height: 32, borderRadius: theme.radius.full, backgroundColor: color }} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
