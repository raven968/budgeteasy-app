import { Text, type TextProps } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import type { Theme } from '@/lib/theme';

type ThemedTextProps = TextProps & {
  variant?: keyof Theme['typography'];
  tone?: 'default' | 'muted' | 'primary' | 'error';
};

export function ThemedText({ variant = 'body', tone = 'default', style, ...props }: ThemedTextProps) {
  const theme = useTheme();
  const toneColor = {
    default: theme.colors.baseContent,
    muted: theme.colors.baseContentMuted,
    primary: theme.colors.primary,
    error: theme.colors.error,
  }[tone];

  return <Text style={[theme.typography[variant], { color: toneColor }, style]} {...props} />;
}
