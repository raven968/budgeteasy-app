import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/button';
import { ErrorState } from '@/components/error-state';
import { LoadingScreen } from '@/components/loading-screen';
import { Screen } from '@/components/screen';
import { CATEGORY_ICON_KEYS, type CategoryIconKey } from '@/features/categories/catalog';
import { CategoryForm } from '@/features/categories/components/category-form';
import { useCategories, useDeleteCategory, useUpdateCategory } from '@/features/categories/hooks';
import type { CategoryPayload } from '@/features/categories/types';
import { getErrorMessage } from '@/lib/api/errors';

export default function EditCategoryScreen() {
  const { t } = useTranslation();
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
  const { data, isPending, error, refetch } = useCategories();
  const updateCategoryMutation = useUpdateCategory(Number(categoryId));
  const deleteCategoryMutation = useDeleteCategory();
  const category = data?.data.find((item) => item.id === Number(categoryId));

  if (isPending) {
    return <LoadingScreen />;
  }

  if (error || !category) {
    return <ErrorState error={error} onRetry={() => refetch()} />;
  }

  const update = async (payload: CategoryPayload) => {
    await updateCategoryMutation.mutateAsync(payload);
    router.back();
  };

  const confirmDelete = () => {
    Alert.alert(t('categories.delete.title'), t('categories.delete.message', { name: category.name }), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () =>
          deleteCategoryMutation
            .mutateAsync(category.id)
            .then(() => router.back())
            .catch((deleteError: unknown) => Alert.alert(getErrorMessage(deleteError))),
      },
    ]);
  };

  const icon = CATEGORY_ICON_KEYS.find((key) => key === category.icon) ?? ('other' satisfies CategoryIconKey);

  return (
    <Screen>
      <Stack.Screen options={{ title: t('categories.edit') }} />
      <CategoryForm
        defaultValues={{ name: category.name, icon, color: category.color }}
        submitLabel={t('common.save')}
        isSubmitting={updateCategoryMutation.isPending}
        onSubmit={update}
      />
      <Button
        title={t('common.delete')}
        variant="ghost"
        onPress={confirmDelete}
        isLoading={deleteCategoryMutation.isPending}
      />
    </Screen>
  );
}
