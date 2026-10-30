import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { ErrorState } from '@/components/error-state';
import { LoadingScreen } from '@/components/loading-screen';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { CategoryListItem } from '@/features/categories/components/category-list-item';
import { useCategories } from '@/features/categories/hooks';
import { useTheme } from '@/hooks/use-theme';

export default function CategoriesScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { data, isPending, error, refetch } = useCategories();

  if (isPending) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const categories = data.data;
  const maxCategories = data.meta.max;
  const isLimitReached = categories.length >= maxCategories;

  return (
    <Screen>
      <Stack.Screen options={{ title: t('categories.title') }} />

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <ThemedText tone="muted" style={{ flexShrink: 1 }}>
          {t('categories.explanation')}
        </ThemedText>
        <Badge
          label={t('categories.counter', { count: categories.length, max: maxCategories })}
          variant={isLimitReached ? 'primary' : 'outline'}
        />
      </View>

      {categories.length === 0 ? <ThemedText tone="muted">{t('categories.empty')}</ThemedText> : null}

      <View style={{ gap: theme.spacing.sm }}>
        {categories.map((category) => (
          <CategoryListItem
            key={category.id}
            category={category}
            onPress={() =>
              router.push({ pathname: '/categories/[categoryId]/edit', params: { categoryId: category.id } })
            }
          />
        ))}
      </View>

      {isLimitReached ? (
        <ThemedText tone="muted">{t('categories.limitReached', { max: maxCategories })}</ThemedText>
      ) : null}
      <Button title={t('categories.new')} onPress={() => router.push('/categories/new')} disabled={isLimitReached} />
    </Screen>
  );
}
