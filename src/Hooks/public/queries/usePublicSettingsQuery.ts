import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '../../../api/settings';

export function usePublicSettingsQuery() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: settingsApi.get,
    staleTime: 5 * 60_000,
  });
}
