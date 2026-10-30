import { AxiosError, AxiosHeaders } from 'axios';

import { getErrorMessage, getValidationErrors } from '@/lib/api/errors';

jest.mock('expo-localization', () => ({ getLocales: () => [{ languageCode: 'es' }] }));

function apiError(status: number, data: unknown): AxiosError {
  const headers = new AxiosHeaders();

  return new AxiosError('Request failed', 'ERR', { headers }, null, {
    status,
    statusText: '',
    headers,
    config: { headers },
    data,
  });
}

describe('getValidationErrors', () => {
  it('returns the field errors of a 422 response', () => {
    const error = apiError(422, { message: 'Invalid', errors: { amount: ['El campo monto es obligatorio.'] } });

    expect(getValidationErrors(error)).toEqual({ amount: ['El campo monto es obligatorio.'] });
  });

  it('returns null for other errors', () => {
    expect(getValidationErrors(apiError(403, { message: 'Forbidden' }))).toBeNull();
    expect(getValidationErrors(new Error('boom'))).toBeNull();
  });
});

describe('getErrorMessage', () => {
  it('uses the message from the API', () => {
    expect(getErrorMessage(apiError(403, { message: 'This action is unauthorized.' }))).toBe(
      'This action is unauthorized.',
    );
  });

  it('explains network failures', () => {
    expect(getErrorMessage(new AxiosError('Network Error'))).toBe(
      'No pudimos conectar con el servidor. Revisa tu conexión.',
    );
  });

  it('falls back to a generic message', () => {
    expect(getErrorMessage(new Error('boom'))).toBe('Ocurrió un error inesperado. Inténtalo de nuevo.');
  });
});
