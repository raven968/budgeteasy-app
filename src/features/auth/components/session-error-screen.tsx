import { useTranslation } from 'react-i18next';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { getErrorMessage } from '@/lib/api/errors';

import { useAuth } from '../auth-provider';

type SessionErrorScreenProps = {
  error: unknown;
};

export function SessionErrorScreen({ error }: SessionErrorScreenProps) {
  const { t } = useTranslation();
  const { restoreSession, signOut } = useAuth();

  return (
    <Screen centered>
      <ThemedText variant="subtitle">{t('auth.sessionError')}</ThemedText>
      <ThemedText tone="muted">{getErrorMessage(error)}</ThemedText>
      <Button title={t('common.retry')} onPress={restoreSession} />
      <Button title={t('auth.signOut')} variant="secondary" onPress={signOut} />
    </Screen>
  );
}
