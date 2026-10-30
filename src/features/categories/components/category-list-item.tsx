import { Pressable } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

import type { Category } from '../types';
import { CategoryIcon } from './category-icon';

type CategoryListItemProps = {
  category: Category;
  onPress: () => void;
};

export function CategoryListItem({ category, onPress }: CategoryListItemProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.md,
        backgroundColor: theme.colors.base100,
        borderColor: theme.colors.base300,
        borderWidth: theme.borderWidth,
        borderRadius: theme.radius.box,
        padding: theme.spacing.md,
        opacity: pressed ? 0.85 : 1,
      })}>
      <CategoryIcon icon={category.icon} color={category.color} />
      <ThemedText variant="subtitle" style={{ flexShrink: 1 }}>
        {category.name}
      </ThemedText>
    </Pressable>
  );
}
