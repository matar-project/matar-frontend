import { useInfiniteQuery } from '@tanstack/react-query';
import { workflowApi } from '../../../api/workflow';

export function useMyAccompanimentRequestsInfiniteQuery(search: string) {
  return useInfiniteQuery({
    queryKey: ['volunteer-accompaniment-requests', search],
    queryFn: ({ pageParam }) =>
      workflowApi.getMyAccompanimentRequests({
        page: pageParam,
        limit: 10,
        search: search || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
}
