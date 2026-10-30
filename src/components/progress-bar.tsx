import { View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

type ProgressBarProps = {
  /** 0–100; values above 100 fill the bar completely. */
  percentage: number;
  color: string;
  height?: number;
  accessibilityLabel?: string;
};

/**
 * daisyUI-like `progress`: a rounded track with a colored fill.
 */
export function ProgressBar({ percentage, color, height = 10, accessibilityLabel }: ProgressBarProps) {
  const theme = useTheme();
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(percentage) }}
      style={{ height, borderRadius: theme.radius.full, backgroundColor: theme.colors.base300, overflow: 'hidden' }}>
      <View style={{ width: `${clampedPercentage}%`, height: '100%', borderRadius: theme.radius.full, backgroundColor: color }} />
    </View>
  );
}
