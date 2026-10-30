import { useQuery } from '@tanstack/react-query';

import { config } from '@/lib/config';
import { compareVersions } from '@/lib/semver';

import { fetchApiVersion } from './api';

export const apiVersionQueryKey = ['api-version'] as const;

export function useApiVersion() {
  return useQuery({
    queryKey: apiVersionQueryKey,
    queryFn: fetchApiVersion,
    staleTime: Infinity,
  });
}

/**
 * Whether this app version is older than the minimum the API accepts.
 * While the check is loading or failing, the app is allowed to continue.
 */
export function useUpdateRequirement() {
  const { data } = useApiVersion();
  const requiredVersion = data?.min_mobile_version ?? null;
  const isUpdateRequired =
    requiredVersion !== null && compareVersions(config.appVersion, requiredVersion) < 0;

  return { isUpdateRequired, requiredVersion, currentVersion: config.appVersion };
}
