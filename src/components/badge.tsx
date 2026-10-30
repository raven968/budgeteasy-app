import { View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

import { ThemedText } from './themed-text';

type BadgeProps = {
  label: string;
  variant?: 'neutral' | 'primary' | 'outline';
};

/**
 * daisyUI-like `badge`: a small pill label.
 */
export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  const theme = useTheme();
  const variantStyle = {
    neutral: { backgroundColor: theme.colors.neutral, borderColor: theme.colors.neutral, color: theme.colors.neutralContent },
    primary: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary, color: theme.colors.primaryContent },
    outline: { backgroundColor: 'transparent', borderColor: theme.colors.base300, color: theme.colors.baseContent },
  }[variant];

  return (
    <View
      style={{
        alignSelf: 'flex-start',
        backgroundColor: variantStyle.backgroundColor,
        borderColor: variantStyle.borderColor,
        borderWidth: theme.borderWidth,
        borderRadius: theme.radius.full,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 2,
      }}>
      <ThemedText variant="caption" style={{ color: variantStyle.color, fontWeight: '600' }}>
        {label}
      </ThemedText>
    </View>
  );
}
