import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { applyApiErrors } from '@/lib/forms';
import { parseMoneyInput } from '@/lib/money';

import { type BudgetFormValues, createBudgetSchema } from '../schemas';
import type { BudgetPayload } from '../types';
import { CurrencyPicker } from './currency-picker';

const FIELD_NAMES = ['name', 'amount', 'currency'] as const;

type BudgetFormProps = {
  defaultValues: BudgetFormValues;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (payload: BudgetPayload) => Promise<unknown>;
};

export function BudgetForm({ defaultValues, submitLabel, isSubmitting, onSubmit }: BudgetFormProps) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<BudgetFormValues>({
    resolver: zodResolver(createBudgetSchema(t)),
    defaultValues,
  });

  const submit = handleSubmit((values) =>
    onSubmit({
      name: values.name.trim(),
      amount: parseMoneyInput(values.amount) ?? 0,
      currency: values.currency,
    }).catch((error: unknown) => applyApiErrors(error, setError, FIELD_NAMES)),
  );

  return (
    <Card>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            label={t('budgets.fields.name')}
            placeholder={t('budgets.fields.namePlaceholder')}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.name?.message}
            maxLength={100}
          />
        )}
      />
      <Controller
        control={control}
        name="amount"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            label={t('budgets.fields.amount')}
            placeholder="0.00"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.amount?.message}
            keyboardType="decimal-pad"
          />
        )}
      />
      <Controller
        control={control}
        name="currency"
        render={({ field: { onChange, value } }) => (
          <CurrencyPicker
            label={t('budgets.fields.currency')}
            value={value}
            onChange={onChange}
            error={errors.currency?.message}
          />
        )}
      />

      {errors.root?.server ? <ThemedText tone="error">{errors.root.server.message}</ThemedText> : null}

      <Button title={submitLabel} onPress={() => submit()} isLoading={isSubmitting} />
    </Card>
  );
}
