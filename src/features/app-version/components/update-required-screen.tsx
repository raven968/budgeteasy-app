import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

type UpdateRequiredScreenProps = {
  currentVersion: string;
  requiredVersion: string;
};

export function UpdateRequiredScreen({ currentVersion, requiredVersion }: UpdateRequiredScreenProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('update.title')}</Text>
      <Text style={styles.message}>
        {t('update.message', { current: currentVersion, required: requiredVersion })}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
});
