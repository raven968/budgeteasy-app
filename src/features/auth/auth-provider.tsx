import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { createContext, type ReactNode, use, useEffect } from 'react';

import { onUnauthorized } from '@/lib/api/client';
import { tokenStorage } from '@/lib/auth/token-storage';
import { queryClient } from '@/lib/query-client';

import { fetchMe, logout } from './api';
import type { AuthToken, User } from './types';

export type AuthState =
  | { status: 'loading' }
  | { status: 'signedOut' }
  | { status: 'signedIn'; user: User }
  /** A stored session exists but couldn't be verified (e.g. no connection). */
  | { status: 'error'; error: unknown };

type AuthContextValue = {
  state: AuthState;
  signIn: (authToken: AuthToken) => Promise<void>;
  signOut: () => Promise<void>;
  restoreSession: () => Promise<void>;
};

export const sessionQueryKey = ['session'] as const;

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * The signed-in user, or null when there is no valid stored token.
 */
async function loadSession(): Promise<User | null> {
  const token = await tokenStorage.load();

  if (!token) {
    return null;
  }

  try {
    return await fetchMe();
  } catch (error) {
    if (isAxiosError(error) && error.response?.status === 401) {
      await tokenStorage.clear();

      return null;
    }

    throw error;
  }
}

/**
 * Drops the token and every cached query except the session, which becomes signed out.
 */
async function clearLocalSession(): Promise<void> {
  await tokenStorage.clear();
  queryClient.removeQueries({ predicate: (query) => query.queryKey[0] !== sessionQueryKey[0] });
  queryClient.setQueryData(sessionQueryKey, null);
}

function toAuthState(sessionQuery: UseQueryResult<User | null>): AuthState {
  if (sessionQuery.isPending || sessionQuery.isRefetching) {
    return { status: 'loading' };
  }

  if (sessionQuery.isError) {
    return { status: 'error', error: sessionQuery.error };
  }

  return sessionQuery.data ? { status: 'signedIn', user: sessionQuery.data } : { status: 'signedOut' };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const sessionQuery = useQuery({
    queryKey: sessionQueryKey,
    queryFn: loadSession,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  useEffect(() => onUnauthorized(() => void clearLocalSession()), []);

  const state = toAuthState(sessionQuery);

  const signIn = async (authToken: AuthToken) => {
    await tokenStorage.set(authToken.token);
    queryClient.setQueryData(sessionQueryKey, authToken.user);
  };

  const signOut = async () => {
    try {
      await logout();
    } catch {
      // The token is discarded locally even if the API can't be reached.
    }

    await clearLocalSession();
  };

  const restoreSession = async () => {
    await sessionQuery.refetch();
  };

  return <AuthContext value={{ state, signIn, signOut, restoreSession }}>{children}</AuthContext>;
}

export function useAuth(): AuthContextValue {
  const context = use(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>.');
  }

  return context;
}
