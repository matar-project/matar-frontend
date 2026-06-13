import { useInfiniteQuery } from '@tanstack/react-query';
import {
  workflowApi,
  type CoordinatorRequestFilter,
} from '../../../api/workflow';
import { COORDINATOR_QUERY_KEYS } from '../../../constants/coordinator.constants';

export function useCoordinatorRequestsInfiniteQuery(
  status: CoordinatorRequestFilter,
  search: string,
) {
  return useInfiniteQuery({
    queryKey: [...COORDINATOR_QUERY_KEYS.requests, status, search],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      workflowApi.getCoordinatorRequests({
        status,
        page: pageParam,
        limit: 10,
        search: search || undefined,
      }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
}
