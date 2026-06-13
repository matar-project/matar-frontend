import { useQuery } from '@tanstack/react-query';
import { requestsApi } from '../../../api/requests';
import { ADMIN_QUERY_KEYS } from '../../../constants/admin.constants';

export function useAdminStatsQuery() {
  return useQuery({
    queryKey: ADMIN_QUERY_KEYS.stats,
    queryFn: requestsApi.getStats,
  });
}
