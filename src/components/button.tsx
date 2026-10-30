import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import { ThemedText } from './themed-text';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
  disabled?: boolean;
};

export function Button({ title, onPress, variant = 'primary', isLoading = false, disabled = false }: ButtonProps) {
  const theme = useTheme();
  const isPrimary = variant === 'primary';
  const isDisabled = disabled || isLoading;
  const textColor = isPrimary ? theme.colors.primaryText : theme.colors.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          borderRadius: theme.radius.md,
          paddingVertical: theme.spacing.md,
          backgroundColor: isPrimary ? theme.colors.primary : 'transparent',
          borderColor: theme.colors.primary,
          opacity: isDisabled ? 0.6 : pressed ? 0.85 : 1,
        },
      ]}>
      {isLoading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <ThemedText variant="label" style={{ color: textColor }}>
          {title}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    minHeight: 48,
  },
});
