import { Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

import { CATEGORY_ICON_KEYS, type CategoryIconKey } from '../catalog';
import { CategoryIcon } from './category-icon';

type IconPickerProps = {
  label: string;
  value: CategoryIconKey;
  color: string;
  onChange: (icon: CategoryIconKey) => void;
};

export function IconPicker({ label, value, color, onChange }: IconPickerProps) {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <View style={{ gap: theme.spacing.xs }}>
      <ThemedText variant="label">{label}</ThemedText>
      <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
        {CATEGORY_ICON_KEYS.map((iconKey) => {
          const isSelected = iconKey === value;

          return (
            <Pressable
              key={iconKey}
              accessibilityRole="radio"
              accessibilityLabel={t(`categories.icons.${iconKey}`)}
              accessibilityState={{ selected: isSelected }}
              onPress={() => onChange(iconKey)}
              style={{
                padding: 3,
                borderRadius: theme.radius.full,
                borderWidth: 2,
                borderColor: isSelected ? theme.colors.primary : 'transparent',
              }}>
              <CategoryIcon icon={iconKey} color={isSelected ? color : theme.colors.base300} size={40} />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
