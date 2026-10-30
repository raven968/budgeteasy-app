import { useTranslation } from 'react-i18next';

import { getErrorMessage } from '@/lib/api/errors';

import { Button } from './button';
import { Screen } from './screen';
import { ThemedText } from './themed-text';

type ErrorStateProps = {
  error: unknown;
  onRetry: () => void;
};

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const { t } = useTranslation();

  return (
    <Screen centered>
      <ThemedText tone="muted">{getErrorMessage(error)}</ThemedText>
      <Button title={t('common.retry')} onPress={onRetry} />
    </Screen>
  );
}
