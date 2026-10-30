import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useApiVersion } from '@/features/app-version/hooks';
import { getErrorMessage } from '@/lib/api/errors';
import { config } from '@/lib/config';

/**
 * Temporary home: confirms the app reaches the API. Replaced by the budgets screen in M2.
 */
export default function Index() {
  const { t } = useTranslation();
  const { data, error, isPending, refetch } = useApiVersion();

  return (
    <View style={styles.container}>
      <Text>{t('home.appVersion', { version: config.appVersion })}</Text>
      {isPending && <ActivityIndicator />}
      {data && <Text>{t('home.apiVersion', { version: data.api_version })}</Text>}
      {error && (
        <>
          <Text>{getErrorMessage(error)}</Text>
          <Button title={t('common.retry')} onPress={() => refetch()} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
});
