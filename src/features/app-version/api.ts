import { apiClient } from '@/lib/api/client';

import type { ApiVersion } from './types';

export async function fetchApiVersion(): Promise<ApiVersion> {
  const response = await apiClient.get<ApiVersion>('/version');

  return response.data;
}
