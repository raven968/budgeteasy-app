import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'budgeteasy.auth_token';

/**
 * Keeps the Sanctum token in the device keychain/keystore, with an in-memory copy so the
 * HTTP client can read it synchronously on every request.
 */
let cachedToken: string | null = null;

export const tokenStorage = {
  async load(): Promise<string | null> {
    cachedToken = await SecureStore.getItemAsync(TOKEN_KEY);

    return cachedToken;
  },

  get(): string | null {
    return cachedToken;
  },

  async set(token: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    cachedToken = token;
  },

  async clear(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    cachedToken = null;
  },
};
