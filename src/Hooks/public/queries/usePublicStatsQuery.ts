import { useQuery } from '@tanstack/react-query';
import { requestsApi } from '../../../api/requests';

export function usePublicStatsQuery() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: requestsApi.getStats,
  });
}
