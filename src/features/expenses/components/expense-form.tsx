import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import type { Category } from '@/features/categories/types';
import { useTheme } from '@/hooks/use-theme';
import { applyApiErrors } from '@/lib/forms';
import { parseMoneyInput } from '@/lib/money';

import { createExpenseSchema, type ExpenseFormValues } from '../schemas';
import type { ExpensePayload } from '../types';
import { CategorySelector } from './category-selector';
import { DateField } from './date-field';

const FIELD_NAMES = ['amount', 'category_id', 'spent_on', 'note'] as const;

type ExpenseFormProps = {
  categories: Category[];
  currency: string;
  defaultValues: ExpenseFormValues;
  submitLabel: string;
  isSubmitting: boolean;
  autoFocusAmount?: boolean;
  onSubmit: (payload: ExpensePayload) => Promise<unknown>;
};

export function ExpenseForm({
  categories,
  currency,
  defaultValues,
  submitLabel,
  isSubmitting,
  autoFocusAmount = false,
  onSubmit,
}: ExpenseFormProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(createExpenseSchema(t)),
    defaultValues,
  });

  const submit = handleSubmit((values) =>
    onSubmit({
      amount: parseMoneyInput(values.amount) ?? 0,
      category_id: values.category_id ?? 0,
      spent_on: values.spent_on,
      note: values.note.trim() || null,
    }).catch((error: unknown) => applyApiErrors(error, setError, FIELD_NAMES)),
  );

  return (
    <Card>
      <Controller
        control={control}
        name="amount"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            label={t('expenses.fields.amount', { currency })}
            placeholder="0.00"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.amount?.message}
            keyboardType="decimal-pad"
            autoFocus={autoFocusAmount}
            style={[theme.typography.title, { minHeight: 64 }]}
          />
        )}
      />
      <Controller
        control={control}
        name="category_id"
        render={({ field: { onChange, value } }) => (
          <CategorySelector
            label={t('expenses.fields.category')}
            categories={categories}
            value={value}
            onChange={onChange}
            error={errors.category_id?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="spent_on"
        render={({ field: { onChange, value } }) => (
          <DateField label={t('expenses.fields.date')} value={value} onChange={onChange} />
        )}
      />
      <Controller
        control={control}
        name="note"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            label={t('expenses.fields.note')}
            placeholder={t('expenses.fields.notePlaceholder')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.note?.message}
            maxLength={255}
          />
        )}
      />

      {errors.root?.server ? <ThemedText tone="error">{errors.root.server.message}</ThemedText> : null}

      <Button title={submitLabel} onPress={() => submit()} isLoading={isSubmitting} />
    </Card>
  );
}
