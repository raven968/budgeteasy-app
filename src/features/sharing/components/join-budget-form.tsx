import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import type { Budget } from '@/features/budgets/types';
import { useTheme } from '@/hooks/use-theme';
import { applyApiErrors } from '@/lib/forms';

import { useAcceptInvitation } from '../hooks';
import { isValidInvitationCode, normalizeInvitationCode } from '../invitation-code';

const FIELD_NAMES = ['code'] as const;

type JoinBudgetFormProps = {
  onJoined: (budget: Budget) => Promise<void> | void;
};

export function JoinBudgetForm({ onJoined }: JoinBudgetFormProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const acceptInvitationMutation = useAcceptInvitation();
  const schema = z.object({
    code: z.string().transform(normalizeInvitationCode).refine(isValidInvitationCode, t('sharing.join.invalidCode')),
  });
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<z.input<typeof schema>, unknown, z.output<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { code: '' },
  });

  const submit = handleSubmit(({ code }) =>
    acceptInvitationMutation
      .mutateAsync(code)
      .then(onJoined)
      .catch((error: unknown) => applyApiErrors(error, setError, FIELD_NAMES)),
  );

  return (
    <Card>
      <ThemedText tone="muted">{t('sharing.join.explanation')}</ThemedText>
      <Controller
        control={control}
        name="code"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            label={t('sharing.join.code')}
            placeholder="ABC234"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.code?.message}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={12}
            onSubmitEditing={() => submit()}
            style={[theme.typography.title, { letterSpacing: 6, textAlign: 'center' }]}
          />
        )}
      />
      {errors.root?.server ? <ThemedText tone="error">{errors.root.server.message}</ThemedText> : null}
      <Button title={t('sharing.join.submit')} onPress={() => submit()} isLoading={acceptInvitationMutation.isPending} />
    </Card>
  );
}
