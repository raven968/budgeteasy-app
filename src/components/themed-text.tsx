import { Text, type TextProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import type { Theme } from '@/lib/theme';

type ThemedTextProps = TextProps & {
  variant?: keyof Theme['typography'];
  tone?: 'default' | 'muted' | 'danger';
};

export function ThemedText({ variant = 'body', tone = 'default', style, ...props }: ThemedTextProps) {
  const theme = useTheme();
  const toneColor = {
    default: theme.colors.text,
    muted: theme.colors.textMuted,
    danger: theme.colors.danger,
  }[tone];

  return <Text style={[theme.typography[variant], { color: toneColor }, style]} {...props} />;
}
