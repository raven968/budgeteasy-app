import { apiClient } from '@/lib/api/client';

import type { AuthToken, LoginPayload, RegisterPayload, User } from './types';

export async function login(payload: LoginPayload): Promise<AuthToken> {
  const response = await apiClient.post<{ data: AuthToken }>('/auth/login', payload);

  return response.data.data;
}

export async function register(payload: RegisterPayload): Promise<AuthToken> {
  const response = await apiClient.post<{ data: AuthToken }>('/auth/register', payload);

  return response.data.data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}

export async function fetchMe(): Promise<User> {
  const response = await apiClient.get<{ data: User }>('/me');

  return response.data.data;
}
