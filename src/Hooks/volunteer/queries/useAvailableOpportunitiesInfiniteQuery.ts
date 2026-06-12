import { useInfiniteQuery } from '@tanstack/react-query';
import { opportunitiesApi } from '../../../api/opportunities';
import { VOLUNTEER_OPPORTUNITY_QUERY_KEYS } from '../../../constants/volunteerOpportunities.constants';

export function useAvailableOpportunitiesInfiniteQuery(search: string) {
  return useInfiniteQuery({
    queryKey: [
      ...VOLUNTEER_OPPORTUNITY_QUERY_KEYS.opportunities,
      search,
    ],
    queryFn: ({ pageParam }) =>
      opportunitiesApi.getAvailableForVolunteer({
        page: pageParam,
        limit: 10,
        search: search || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
}
