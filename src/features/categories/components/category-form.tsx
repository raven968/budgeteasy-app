import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { applyApiErrors } from '@/lib/forms';

import { type CategoryFormValues, createCategorySchema } from '../schemas';
import type { CategoryPayload } from '../types';
import { CategoryIcon } from './category-icon';
import { ColorPicker } from './color-picker';
import { IconPicker } from './icon-picker';

const FIELD_NAMES = ['name', 'icon', 'color'] as const;

type CategoryFormProps = {
  defaultValues: CategoryFormValues;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (payload: CategoryPayload) => Promise<unknown>;
};

export function CategoryForm({ defaultValues, submitLabel, isSubmitting, onSubmit }: CategoryFormProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(createCategorySchema(t)),
    defaultValues,
  });
  const [previewName, previewIcon, previewColor] = useWatch({ control, name: ['name', 'icon', 'color'] });

  const submit = handleSubmit((values) =>
    onSubmit({ ...values, name: values.name.trim() }).catch((error: unknown) =>
      applyApiErrors(error, setError, FIELD_NAMES),
    ),
  );

  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
        <CategoryIcon icon={previewIcon} color={previewColor} size={48} />
        <ThemedText variant="subtitle" tone={previewName.trim() ? 'default' : 'muted'} style={{ flexShrink: 1 }}>
          {previewName.trim() || t('categories.fields.namePlaceholder')}
        </ThemedText>
      </View>

      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            label={t('categories.fields.name')}
            placeholder={t('categories.fields.namePlaceholder')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.name?.message}
            maxLength={50}
          />
        )}
      />
      <Controller
        control={control}
        name="icon"
        render={({ field: { onChange, value } }) => (
          <IconPicker label={t('categories.fields.icon')} value={value} color={previewColor} onChange={onChange} />
        )}
      />
      <Controller
        control={control}
        name="color"
        render={({ field: { onChange, value } }) => (
          <ColorPicker label={t('categories.fields.color')} value={value} onChange={onChange} />
        )}
      />

      {errors.root?.server ? <ThemedText tone="error">{errors.root.server.message}</ThemedText> : null}

      <Button title={submitLabel} onPress={() => submit()} isLoading={isSubmitting} />
    </Card>
  );
}
