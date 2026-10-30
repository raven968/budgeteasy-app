import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { Screen } from '@/components/screen';
import { CATEGORY_COLORS } from '@/features/categories/catalog';
import { CategoryForm } from '@/features/categories/components/category-form';
import { useCreateCategory } from '@/features/categories/hooks';
import type { CategoryPayload } from '@/features/categories/types';

export default function NewCategoryScreen() {
  const { t } = useTranslation();
  const createCategoryMutation = useCreateCategory();

  const create = async (payload: CategoryPayload) => {
    await createCategoryMutation.mutateAsync(payload);
    router.back();
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: t('categories.new') }} />
      <CategoryForm
        defaultValues={{ name: '', icon: 'cart', color: CATEGORY_COLORS[7] }}
        submitLabel={t('categories.create')}
        isSubmitting={createCategoryMutation.isPending}
        onSubmit={create}
      />
    </Screen>
  );
}
