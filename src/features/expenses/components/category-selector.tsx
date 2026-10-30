import { Pressable, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { CategoryIcon } from '@/features/categories/components/category-icon';
import type { Category } from '@/features/categories/types';
import { useTheme } from '@/hooks/use-theme';

type CategorySelectorProps = {
  label: string;
  categories: Category[];
  value: number | undefined;
  onChange: (categoryId: number) => void;
  error?: string;
};

export function CategorySelector({ label, categories, value, onChange, error }: CategorySelectorProps) {
  const theme = useTheme();

  return (
    <View style={{ gap: theme.spacing.xs }}>
      <ThemedText variant="label">{label}</ThemedText>
      <View accessibilityRole="radiogroup" style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm }}>
        {categories.map((category) => {
          const isSelected = category.id === value;

          return (
            <Pressable
              key={category.id}
              accessibilityRole="radio"
              accessibilityLabel={category.name}
              accessibilityState={{ selected: isSelected }}
              onPress={() => onChange(category.id)}
              style={{
                width: 76,
                alignItems: 'center',
                gap: theme.spacing.xs,
                paddingVertical: theme.spacing.sm,
                borderRadius: theme.radius.field,
                borderWidth: 2,
                borderColor: isSelected ? theme.colors.primary : 'transparent',
                backgroundColor: isSelected ? theme.colors.base200 : 'transparent',
              }}>
              <CategoryIcon icon={category.icon} color={category.color} />
              <ThemedText variant="caption" numberOfLines={1} style={{ maxWidth: 68 }}>
                {category.name}
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
