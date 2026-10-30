import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { ThemedText } from '@/components/themed-text';

type NoCategoriesNoticeProps = {
  isOwner: boolean;
};

/**
 * Expenses need a category; budgets use their owner's categories.
 */
export function NoCategoriesNotice({ isOwner }: NoCategoriesNoticeProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <ThemedText variant="subtitle">{t('expenses.noCategories.title')}</ThemedText>
      <ThemedText tone="muted">
        {isOwner ? t('expenses.noCategories.owner') : t('expenses.noCategories.member')}
      </ThemedText>
      {isOwner ? <Button title={t('categories.new')} onPress={() => router.push('/categories/new')} /> : null}
    </Card>
  );
}
