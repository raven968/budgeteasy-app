import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

import { getErrorMessage, getValidationErrors } from '@/lib/api/errors';

/**
 * Shows an API error on the form: 422 field errors go to their fields (API field names
 * match the form field names), anything else goes to the form's `root` error.
 */
export function applyApiErrors<TFieldValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TFieldValues>,
  fieldNames: readonly Path<TFieldValues>[],
): void {
  const validationErrors = getValidationErrors(error);
  const fieldErrors = Object.entries(validationErrors ?? {}).filter(([field]) =>
    fieldNames.includes(field as Path<TFieldValues>),
  );

  for (const [field, messages] of fieldErrors) {
    setError(field as Path<TFieldValues>, { type: 'server', message: messages[0] });
  }

  if (fieldErrors.length === 0) {
    setError('root.server', { type: 'server', message: getErrorMessage(error) });
  }
}
