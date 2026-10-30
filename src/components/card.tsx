import type { ReactNode } from 'react';
import { View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type CardProps = {
  children: ReactNode;
};

/**
 * daisyUI-like `card`: a `base100` surface with the `box` radius on the `base200` background.
 */
export function Card({ children }: CardProps) {
  const theme = useTheme();

  return (
    <View
      style={{
        backgroundColor: theme.colors.base100,
        borderColor: theme.colors.base300,
        borderWidth: theme.borderWidth,
        borderRadius: theme.radius.box,
        padding: theme.spacing.xl,
        gap: theme.spacing.lg,
      }}>
      {children}
    </View>
  );
}
