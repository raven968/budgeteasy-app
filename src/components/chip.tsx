import { Pressable } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import { ThemedText } from './themed-text';

type ChipProps = {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  /** `radio` inside single-choice groups, `button` for standalone toggles. */
  role?: 'radio' | 'button';
};

/**
 * Selectable pill, like daisyUI's `btn btn-sm` toggles.
 */
export function Chip({ label, isSelected, onPress, role = 'radio' }: ChipProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole={role}
      accessibilityState={{ selected: isSelected }}
      onPress={onPress}
      style={{
        borderRadius: theme.radius.full,
        borderWidth: theme.borderWidth,
        borderColor: isSelected ? theme.colors.primary : theme.colors.base300,
        backgroundColor: isSelected ? theme.colors.primary : theme.colors.base100,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs + 2,
      }}>
      <ThemedText
        variant="label"
        style={{ color: isSelected ? theme.colors.primaryContent : theme.colors.baseContent }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}
