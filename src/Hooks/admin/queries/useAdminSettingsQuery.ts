import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '../../../api/settings';
import { ADMIN_QUERY_KEYS } from '../../../constants/admin.constants';

export function useAdminSettingsQuery() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.settings,
    queryFn: settingsApi.get,
  });
}
