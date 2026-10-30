import { QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { AxiosError, AxiosHeaders } from 'axios';
import type { ReactNode } from 'react';

import { fetchMe, logout } from '@/features/auth/api';
import { AuthProvider, useAuth } from '@/features/auth/auth-provider';
import type { User } from '@/features/auth/types';
import { tokenStorage } from '@/lib/auth/token-storage';
import { queryClient } from '@/lib/query-client';

jest.mock('@/features/auth/api');
jest.mock('@/lib/auth/token-storage', () => ({
  tokenStorage: { load: jest.fn(), get: jest.fn(), set: jest.fn(), clear: jest.fn() },
}));

const mockedFetchMe = jest.mocked(fetchMe);
const mockedLogout = jest.mocked(logout);
const mockedTokenStorage = jest.mocked(tokenStorage);

const user: User = { id: 1, name: 'Aron', email: 'aron@example.com', created_at: '2026-10-30T00:00:00Z' };

function apiError(status?: number): AxiosError {
  const headers = new AxiosHeaders();
  const response = status ? { status, statusText: '', headers, config: { headers }, data: {} } : undefined;

  return new AxiosError('Request failed', 'ERR', { headers }, null, response);
}

function wrapper({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}

beforeEach(() => {
  jest.clearAllMocks();
  queryClient.clear();
  queryClient.setDefaultOptions({ queries: { retry: false } });
});

it('starts signed out without a stored token', async () => {
  mockedTokenStorage.load.mockResolvedValue(null);

  const { result } = await renderHook(() => useAuth(), { wrapper });

  await waitFor(() => expect(result.current.state.status).toBe('signedOut'));
  expect(mockedFetchMe).not.toHaveBeenCalled();
});

it('restores the session from a stored token', async () => {
  mockedTokenStorage.load.mockResolvedValue('stored-token');
  mockedFetchMe.mockResolvedValue(user);

  const { result } = await renderHook(() => useAuth(), { wrapper });

  await waitFor(() => expect(result.current.state).toEqual({ status: 'signedIn', user }));
});

it('discards a stored token the API rejects', async () => {
  mockedTokenStorage.load.mockResolvedValue('revoked-token');
  mockedFetchMe.mockRejectedValue(apiError(401));

  const { result } = await renderHook(() => useAuth(), { wrapper });

  await waitFor(() => expect(result.current.state.status).toBe('signedOut'));
  expect(mockedTokenStorage.clear).toHaveBeenCalled();
});

it('reports an error and keeps the token when the API is unreachable', async () => {
  mockedTokenStorage.load.mockResolvedValue('stored-token');
  mockedFetchMe.mockRejectedValueOnce(apiError()).mockResolvedValueOnce(user);

  const { result } = await renderHook(() => useAuth(), { wrapper });

  await waitFor(() => expect(result.current.state.status).toBe('error'));
  expect(mockedTokenStorage.clear).not.toHaveBeenCalled();

  await act(() => result.current.restoreSession());

  await waitFor(() => expect(result.current.state).toEqual({ status: 'signedIn', user }));
});

it('signs in by storing the token', async () => {
  mockedTokenStorage.load.mockResolvedValue(null);
  const { result } = await renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(result.current.state.status).toBe('signedOut'));

  await act(() => result.current.signIn({ token: 'new-token', token_type: 'Bearer', user }));

  expect(mockedTokenStorage.set).toHaveBeenCalledWith('new-token');
  await waitFor(() => expect(result.current.state).toEqual({ status: 'signedIn', user }));
});

it('signs out locally even if the API call fails', async () => {
  mockedTokenStorage.load.mockResolvedValue('stored-token');
  mockedFetchMe.mockResolvedValue(user);
  mockedLogout.mockRejectedValue(apiError());
  const { result } = await renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(result.current.state.status).toBe('signedIn'));

  await act(() => result.current.signOut());

  expect(mockedTokenStorage.clear).toHaveBeenCalled();
  await waitFor(() => expect(result.current.state.status).toBe('signedOut'));
});
