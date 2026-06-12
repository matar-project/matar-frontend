import { useQuery } from '@tanstack/react-query';
import { requestsApi } from '../../../api/requests';
import { ADMIN_QUERY_KEYS } from '../../../constants/admin.constants';

export function useRecentAdminRequestsQuery() {
  return useQuery({
    queryKey: [...ADMIN_QUERY_KEYS.requests, 'recent'],
    queryFn: () => requestsApi.getRequests({ page: 1, limit: 5 }),
  });
}
