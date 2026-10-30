import { ActivityIndicator, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export function LoadingScreen() {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.base200 }}>
      <ActivityIndicator color={theme.colors.primary} />
    </View>
  );
}
