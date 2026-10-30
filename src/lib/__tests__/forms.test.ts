import { AxiosError, AxiosHeaders } from 'axios';

import { applyApiErrors } from '@/lib/forms';

type FormValues = { email: string; password: string };

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

it('maps validation errors to their fields', () => {
  const setError = jest.fn();

  applyApiErrors<FormValues>(
    apiError(422, { message: 'Invalid', errors: { email: ['Estas credenciales no coinciden.'] } }),
    setError,
    ['email', 'password'],
  );

  expect(setError).toHaveBeenCalledTimes(1);
  expect(setError).toHaveBeenCalledWith('email', { type: 'server', message: 'Estas credenciales no coinciden.' });
});

it('uses the root error for errors without a matching field', () => {
  const setError = jest.fn();

  applyApiErrors<FormValues>(apiError(429, { message: 'Demasiados intentos.' }), setError, ['email', 'password']);

  expect(setError).toHaveBeenCalledWith('root.server', { type: 'server', message: 'Demasiados intentos.' });
});

it('uses the root error for validation errors on fields the form does not have', () => {
  const setError = jest.fn();

  applyApiErrors<FormValues>(
    apiError(422, { message: 'Invalid', errors: { device_name: ['Required'] } }),
    setError,
    ['email', 'password'],
  );

  expect(setError).toHaveBeenCalledWith('root.server', { type: 'server', message: 'Invalid' });
});
