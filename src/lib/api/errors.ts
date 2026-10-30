import { isAxiosError } from 'axios';

import i18n from '@/lib/i18n';

/** Laravel validation error body (422). */
export type ValidationErrorBody = {
  message: string;
  errors: Record<string, string[]>;
};

/**
 * Field errors of a 422 response, keyed by the API field name (snake_case).
 */
export function getValidationErrors(error: unknown): Record<string, string[]> | null {
  if (isAxiosError<ValidationErrorBody>(error) && error.response?.status === 422) {
    return error.response.data.errors ?? {};
  }

  return null;
}

/**
 * A message ready to show to the user. The API already answers in the app language.
 */
export function getErrorMessage(error: unknown): string {
  if (isAxiosError<{ message?: string }>(error)) {
    if (!error.response) {
      return i18n.t('errors.network');
    }

    if (error.response.data?.message) {
      return error.response.data.message;
    }
  }

  return i18n.t('errors.unexpected');
}
