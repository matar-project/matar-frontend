import { useInfiniteQuery } from '@tanstack/react-query';
import { requestsApi } from '../../../api/requests';
import {
  ADMIN_PAGE_SIZE,
  ADMIN_QUERY_KEYS,
} from '../../../constants/admin.constants';

export function useAdminRequestsInfiniteQuery(status: string, search: string) {
  return useInfiniteQuery({
    queryKey: [...ADMIN_QUERY_KEYS.requests, status, search],
    queryFn: ({ pageParam }) =>
      requestsApi.getRequests({
        page: pageParam,
        limit: ADMIN_PAGE_SIZE,
        status: status || undefined,
        search: search || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
}
