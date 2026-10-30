import '@/lib/i18n';

import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';

import { UpdateRequiredScreen } from '@/features/app-version/components/update-required-screen';
import { useUpdateRequirement } from '@/features/app-version/hooks';
import { queryClient } from '@/lib/query-client';

function AppNavigator() {
  const { isUpdateRequired, requiredVersion, currentVersion } = useUpdateRequirement();

  if (isUpdateRequired && requiredVersion) {
    return <UpdateRequiredScreen currentVersion={currentVersion} requiredVersion={requiredVersion} />;
  }

  return <Stack />;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppNavigator />
    </QueryClientProvider>
  );
}
