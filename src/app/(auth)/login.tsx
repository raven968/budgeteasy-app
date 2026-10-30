import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { ThemedText } from '@/components/themed-text';
import { useLogin } from '@/features/auth/hooks';
import { createLoginSchema, type LoginFormValues } from '@/features/auth/schemas';
import { applyApiErrors } from '@/lib/forms';

const FIELD_NAMES = ['email', 'password'] as const;

export default function LoginScreen() {
  const { t } = useTranslation();
  const loginMutation = useLogin();
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(createLoginSchema(t)),
    defaultValues: { email: '', password: '' },
  });

  const submit = handleSubmit((values) =>
    loginMutation.mutateAsync(values).catch((error: unknown) => applyApiErrors(error, setError, FIELD_NAMES)),
  );

  return (
    <Screen centered>
      <ThemedText variant="title">{t('auth.login.title')}</ThemedText>
      <ThemedText tone="muted">{t('auth.login.subtitle')}</ThemedText>

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
            autoComplete="current-password"
            textContentType="password"
            onSubmitEditing={() => submit()}
          />
        )}
      />

      {errors.root?.server ? <ThemedText tone="danger">{errors.root.server.message}</ThemedText> : null}

      <Button title={t('auth.login.submit')} onPress={submit} isLoading={loginMutation.isPending} />

      <Link href="/register" replace>
        <ThemedText tone="muted">{t('auth.login.noAccount')}</ThemedText>
      </Link>
    </Screen>
  );
}
