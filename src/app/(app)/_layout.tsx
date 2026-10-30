import { Stack } from 'expo-router';

import { ActiveBudgetProvider } from '@/features/budgets/active-budget-provider';
import { useTheme } from '@/hooks/use-theme';

export default function AppLayout() {
  const theme = useTheme();

  return (
    <ActiveBudgetProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.base200 },
          headerTintColor: theme.colors.baseContent,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: theme.colors.base200 },
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </ActiveBudgetProvider>
  );
}
