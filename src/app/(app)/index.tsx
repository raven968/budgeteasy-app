import { useTranslation } from 'react-i18next';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { useApiVersion } from '@/features/app-version/hooks';
import { useAuth } from '@/features/auth/auth-provider';
import { config } from '@/lib/config';

/**
 * Temporary home until the budgets screen (M2).
 */
export default function HomeScreen() {
  const { t } = useTranslation();
  const { state, signOut } = useAuth();
  const { data: apiVersion } = useApiVersion();
  const userName = state.status === 'signedIn' ? state.user.name : '';

  return (
    <Screen centered>
      <ThemedText variant="title">{t('home.greeting', { name: userName })}</ThemedText>
      <ThemedText tone="muted">{t('home.appVersion', { version: config.appVersion })}</ThemedText>
      {apiVersion ? (
        <ThemedText tone="muted">{t('home.apiVersion', { version: apiVersion.api_version })}</ThemedText>
      ) : null}
      <Button title={t('auth.signOut')} variant="outline" onPress={signOut} />
    </Screen>
  );
}
