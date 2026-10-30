import { QueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';

const NON_RETRYABLE_STATUSES = new Set([401, 403, 404, 422]);
const MAX_RETRIES = 2;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: (failureCount, error) => {
        const status = isAxiosError(error) ? error.response?.status : undefined;

        if (status && NON_RETRYABLE_STATUSES.has(status)) {
          return false;
        }

        return failureCount < MAX_RETRIES;
      },
    },
  },
});
