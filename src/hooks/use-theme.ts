import { useColorScheme } from 'react-native';

import { type Theme, themes } from '@/lib/theme';

export function useTheme(): Theme {
  const colorScheme = useColorScheme();

  return colorScheme === 'dark' ? themes.dark : themes.light;
}
