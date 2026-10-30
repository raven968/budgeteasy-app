import type { TFunction } from 'i18next';
import { z } from 'zod';

const MIN_PASSWORD_LENGTH = 8;

export function createLoginSchema(t: TFunction) {
  return z.object({
    email: z.email(t('validation.email')),
    password: z.string().min(1, t('validation.required')),
  });
}

/**
 * Mirrors the API password policy (8+ characters with letters and numbers) so the user
 * gets feedback before submitting; the API remains the source of truth.
 */
export function createRegisterSchema(t: TFunction) {
  return z
    .object({
      name: z.string().trim().min(1, t('validation.required')).max(255),
      email: z.email(t('validation.email')),
      password: z
        .string()
        .min(MIN_PASSWORD_LENGTH, t('validation.passwordLength', { min: MIN_PASSWORD_LENGTH }))
        .regex(/[A-Za-z]/, t('validation.passwordLetters'))
        .regex(/\d/, t('validation.passwordNumbers')),
      password_confirmation: z.string(),
    })
    .refine((values) => values.password === values.password_confirmation, {
      path: ['password_confirmation'],
      message: t('validation.passwordConfirmation'),
    });
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>;
export type RegisterFormValues = z.infer<ReturnType<typeof createRegisterSchema>>;
