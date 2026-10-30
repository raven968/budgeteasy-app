import { create, isAxiosError } from 'axios';

import { tokenStorage } from '@/lib/auth/token-storage';
import { config } from '@/lib/config';
import i18n from '@/lib/i18n';

/**
 * Axios instance for the BudgetEasy API. Adds the Bearer token and the app language
 * to every request. Response keys stay in the API's snake_case.
 */
export const apiClient = create({
  baseURL: config.apiUrl,
  timeout: 15_000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((requestConfig) => {
  const token = tokenStorage.get();

  if (token) {
    requestConfig.headers.Authorization = `Bearer ${token}`;
  }

  requestConfig.headers['Accept-Language'] = i18n.language;

  return requestConfig;
});

type UnauthorizedListener = () => void;

let unauthorizedListener: UnauthorizedListener | null = null;

/**
 * Registers the callback run when the API answers 401 (expired or revoked token),
 * so the auth layer can sign the user out.
 */
export function onUnauthorized(listener: UnauthorizedListener): () => void {
  unauthorizedListener = listener;

  return () => {
    unauthorizedListener = null;
  };
}

apiClient.interceptors.response.use(undefined, (error: unknown) => {
  if (isAxiosError(error) && error.response?.status === 401) {
    unauthorizedListener?.();
  }

  return Promise.reject(error);
});
