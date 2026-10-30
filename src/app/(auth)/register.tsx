import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { useRegister } from '@/features/auth/hooks';
import { createRegisterSchema, type RegisterFormValues } from '@/features/auth/schemas';
import { applyApiErrors } from '@/lib/forms';

const FIELD_NAMES = ['name', 'email', 'password', 'password_confirmation'] as const;

export default function RegisterScreen() {
  const { t } = useTranslation();
  const registerMutation = useRegister();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(createRegisterSchema(t)),
    defaultValues: { name: '', email: '', password: '', password_confirmation: '' },
  });

  const submit = handleSubmit((values) =>
    registerMutation.mutateAsync(values).catch((error: unknown) => applyApiErrors(error, setError, FIELD_NAMES)),
  );

  return (
    <Screen centered>
      <ThemedText variant="title">{t('auth.register.title')}</ThemedText>
      <ThemedText tone="muted">{t('auth.register.subtitle')}</ThemedText>

      <Card>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label={t('auth.fields.name')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.name?.message}
              autoComplete="name"
              textContentType="name"
            />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label={t('auth.fields.email')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.email?.message}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              textContentType="emailAddress"
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label={t('auth.fields.password')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password?.message}
              secureTextEntry
              autoComplete="new-password"
              textContentType="newPassword"
            />
          )}
        />
        <Controller
          control={control}
          name="password_confirmation"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextField
              label={t('auth.fields.passwordConfirmation')}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.password_confirmation?.message}
              secureTextEntry
              autoComplete="new-password"
              textContentType="newPassword"
              onSubmitEditing={() => submit()}
            />
          )}
        />

        {errors.root?.server ? <ThemedText tone="error">{errors.root.server.message}</ThemedText> : null}

        <Button title={t('auth.register.submit')} onPress={submit} isLoading={registerMutation.isPending} />
      </Card>

      <Link href="/login" replace>
        <ThemedText tone="primary">{t('auth.register.hasAccount')}</ThemedText>
      </Link>
    </Screen>
  );
}
