import '@/lib/i18n';

import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { UpdateRequiredScreen } from '@/features/app-version/components/update-required-screen';
import { useUpdateRequirement } from '@/features/app-version/hooks';
import { AuthProvider, useAuth } from '@/features/auth/auth-provider';
import { SessionErrorScreen } from '@/features/auth/components/session-error-screen';
import { queryClient } from '@/lib/query-client';

SplashScreen.preventAutoHideAsync();

function AppNavigator() {
  const { state } = useAuth();
  const { isUpdateRequired, requiredVersion, currentVersion } = useUpdateRequirement();
  const isSignedIn = state.status === 'signedIn';

  useEffect(() => {
    if (state.status !== 'loading') {
      SplashScreen.hideAsync();
    }
  }, [state.status]);

  if (isUpdateRequired && requiredVersion) {
    return <UpdateRequiredScreen currentVersion={currentVersion} requiredVersion={requiredVersion} />;
  }

  if (state.status === 'loading') {
    return null;
  }

  if (state.status === 'error') {
    return <SessionErrorScreen error={state.error} />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isSignedIn} redirectTo="/login">
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!isSignedIn} redirectTo="/">
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </QueryClientProvider>
  );
}
