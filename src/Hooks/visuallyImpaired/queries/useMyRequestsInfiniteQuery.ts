import { useInfiniteQuery } from '@tanstack/react-query';
import { requestsApi } from '../../../api/requests';

export function useMyRequestsInfiniteQuery() {
  return useInfiniteQuery({
    queryKey: ['my-requests'],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      requestsApi.getMyRequests({ page: pageParam, limit: 10 }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
}
