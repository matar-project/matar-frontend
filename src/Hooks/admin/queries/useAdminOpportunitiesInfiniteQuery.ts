import { useInfiniteQuery } from '@tanstack/react-query';
import { opportunitiesApi } from '../../../api/settings';
import {
  ADMIN_PAGE_SIZE,
  ADMIN_QUERY_KEYS,
} from '../../../constants/admin.constants';

export function useAdminOpportunitiesInfiniteQuery(search: string) {
  return useInfiniteQuery({
    queryKey: [...ADMIN_QUERY_KEYS.opportunities, search],
    queryFn: ({ pageParam }) =>
      opportunitiesApi.getAll({
        page: pageParam,
        limit: ADMIN_PAGE_SIZE,
        search: search || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
}
