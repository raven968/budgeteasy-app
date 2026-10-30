import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import { ThemedText } from './themed-text';

type ButtonProps = {
  title: string;
  onPress: () => void;
  /** daisyUI-like variants: solid `primary`, `outline` and borderless `ghost`. */
  variant?: 'primary' | 'outline' | 'ghost';
  isLoading?: boolean;
  disabled?: boolean;
};

export function Button({ title, onPress, variant = 'primary', isLoading = false, disabled = false }: ButtonProps) {
  const theme = useTheme();
  const isDisabled = disabled || isLoading;
  const variantStyle = {
    primary: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary, textColor: theme.colors.primaryContent },
    outline: { backgroundColor: 'transparent', borderColor: theme.colors.primary, textColor: theme.colors.primary },
    ghost: { backgroundColor: 'transparent', borderColor: 'transparent', textColor: theme.colors.baseContent },
  }[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          borderRadius: theme.radius.field,
          borderWidth: theme.borderWidth,
          paddingHorizontal: theme.spacing.lg,
          backgroundColor: variantStyle.backgroundColor,
          borderColor: variantStyle.borderColor,
          opacity: isDisabled ? 0.5 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
      ]}>
      {isLoading ? (
        <ActivityIndicator color={variantStyle.textColor} />
      ) : (
        <ThemedText variant="button" style={{ color: variantStyle.textColor }}>
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
    minHeight: 48,
  },
});
