import { useInfiniteQuery } from '@tanstack/react-query';
import { workflowApi } from '../../../api/workflow';
import { VOLUNTEER_OPPORTUNITY_QUERY_KEYS } from '../../../constants/volunteerOpportunities.constants';

export function useAvailableRequestsInfiniteQuery(search: string) {
  return useInfiniteQuery({
    queryKey: [
      ...VOLUNTEER_OPPORTUNITY_QUERY_KEYS.availableRequests,
      search,
    ],
    queryFn: ({ pageParam }) =>
      workflowApi.getAvailableRequests({
        page: pageParam,
        limit: 10,
        search: search || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
}
